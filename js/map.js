mapboxgl.accessToken = 'pk.eyJ1Ijoib2Nhc3RpIiwiYSI6ImNtaGJlcHR0bzBkbHEyam9hZjUxdTN2em8ifQ.1dlbHGkcsfz7UDrymlleLA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-122.3321, 47.6062],
    zoom: 12
});

let activeFilters = ['Budget', 'Mid-Range', 'Premium'];
let userLocation = null;
let allStores = [];

map.on('load', () => {
    loadAllLayers();
    setupEventListeners();
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');


function loadAllLayers() {

    map.addSource('lila-data', {
        type: 'geojson',
        data: '../assets/LILA_Tracts.geojson' 
    });

    map.addLayer({
        id: 'lila-layer',
        type: 'fill',
        source: 'lila-data',
        paint: {
            'fill-color': [
                'match',
                ['get', 'LILATracts_1And10'], 
                1, '#FF4D4D',
                'transparent'
            ],
            'fill-opacity': 0.5
        }
    }); 

    map.addSource('emergency-food', {
        type: 'geojson',
        data: '../assets/emergency_food.geojson'
    });

    const starSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <polygon points="12,2 15,9 22,9 17,13 19,20 12,16 5,20 7,13 2,9 9,9"
                 fill="#9fc9ff" stroke="#ffffff" stroke-width="1.5"/>
      </svg>`;

    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(starSvg);
    img.onload = () => {
        if (!map.hasImage('star-icon')) {
            map.addImage('star-icon', img);
        }

        map.addLayer({
            id: 'emergency-food-symbol',
            type: 'symbol',
            source: 'emergency-food',
            layout: {
                'icon-image': 'star-icon',
                'icon-size': 1.2,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        });

        map.on('click', 'emergency-food-symbol', (e) => {
            const props = e.features[0].properties;
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <strong>${props.Agency || 'Food Provider'}</strong><br>
                    ${props.Address || ''}<br>
                    <em>${props['Food Resource Type'] || ''}</em><br>
                    ${props['Days/Hours'] || ''}
                `)
                .addTo(map);
        });

        map.on('mouseenter', 'emergency-food-symbol', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'emergency-food-symbol', () => {
            map.getCanvas().style.cursor = '';
        });
    };

    map.addSource('seattle-neighborhoods', {
        type: 'geojson',
        data: '../assets/seattle_hoods.geojson'
    });

    map.addLayer({
        id: 'seattle-neighborhoods-outline',
        type: 'line',
        source: 'seattle-neighborhoods',
        paint: {
            'line-color': '#666666',
            'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 1,
                12, 2,
                15, 3
            ],
            'line-opacity': 0.9
        }
    });

    map.addSource('grocery-stores', {
        type: 'geojson',
        data: '../assets/stores.geojson'
    });

    fetch('../assets/stores.geojson')
        .then(response => response.json())
        .then(data => {
            allStores = data.features;
        })
        .catch(error => console.error('Error loading stores:', error));

    map.addLayer({
        id: 'store-points',
        type: 'circle',
        source: 'grocery-stores',
        paint: {
            'circle-radius': 10,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-color': [
                'match',
                ['get', 'Price_Tier'],
                'Budget', '#789c78',
                'Mid-Range', '#ffd54f',
                'Premium', '#d38282',
                '#ccc'
            ]
        }
    });

    map.on('click', 'store-points', (e) => {
        const props = e.features[0].properties;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <strong>${props['Trade Name'] || props.TradeName || 'Store'}</strong><br>
                ${props.Address || props['Address'] || ''}<br>
                <em>Price Tier: ${props.Price_Tier || props['Price Tier'] || 'Unknown'}</em>
            `)
            .addTo(map);
    });

    map.on('mouseenter', 'store-points', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'store-points', () => {
        map.getCanvas().style.cursor = '';
    });
}

function setupEventListeners() {
    
    document.getElementById('console')?.addEventListener('change', handlePriceFilter);
    
    const budgetCheckbox = document.getElementById('Budget');
    const midRangeCheckbox = document.getElementById('Mid-Range');
    const premiumCheckbox = document.getElementById('Premium');
    
    [budgetCheckbox, midRangeCheckbox, premiumCheckbox].forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', handlePriceFilter);
        }
    });

    const emergencyCheckbox = document.getElementById('show-emergency');
    const neighborhoodsCheckbox = document.getElementById('show-neighborhoods');

    if (emergencyCheckbox) {
        emergencyCheckbox.addEventListener('change', (e) => {
            const visibility = e.target.checked ? 'visible' : 'none';
            map.setLayoutProperty('emergency-food-symbol', 'visibility', visibility);
        });
    }

    if (neighborhoodsCheckbox) {
        neighborhoodsCheckbox.addEventListener('change', (e) => {
            const visibility = e.target.checked ? 'visible' : 'none';
            map.setLayoutProperty('seattle-neighborhoods-outline', 'visibility', visibility);
        });
    }

    const locateBtn = document.getElementById('locateBtn');
    if (locateBtn) {
        locateBtn.addEventListener('click', getUserLocation);
    }

    const togglePanel = document.getElementById('togglePanel');
    const controlPanel = document.getElementById('control-panel');
    if (togglePanel && controlPanel) {
        togglePanel.addEventListener('click', () => {
            controlPanel.classList.toggle('collapsed');
        });
    }
}

function handlePriceFilter() {
    activeFilters = [];
    
    const checkboxes = ['Budget', 'Mid-Range', 'Premium'];
    checkboxes.forEach(tier => {
        const checkbox = document.getElementById(tier);
        if (checkbox && checkbox.checked) {
            activeFilters.push(tier);
        }
    });

    let filterExpression;
    if (activeFilters.length === 0) {
        filterExpression = ['literal', false];
    } else if (activeFilters.length === 1) {
        filterExpression = ['==', ['get', 'Price_Tier'], activeFilters[0]];
    } else {
        filterExpression = [
            'any',
            ...activeFilters.map(tier => ['==', ['get', 'Price_Tier'], tier])
        ];
    }

    map.setFilter('store-points', filterExpression);
}

function getUserLocation() {
    const statusDiv = document.getElementById('location-status');
    
    if (!navigator.geolocation) {
        showStatus('Geolocation is not supported by your browser', 'error');
        return;
    }

    showStatus('Getting your location...', 'loading');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                lng: position.coords.longitude,
                lat: position.coords.latitude
            };

            if (map.getLayer('user-location')) {
                map.removeLayer('user-location');
                map.removeSource('user-location');
            }

            map.addSource('user-location', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [userLocation.lng, userLocation.lat]
                    }
                }
            });

            map.addLayer({
                id: 'user-location',
                type: 'circle',
                source: 'user-location',
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#4285F4',
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#ffffff'
                }
            });

            map.flyTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 13,
                duration: 1500
            });

            showStatus('Location found!', 'success');
            findNearestStores();
        },
        (error) => {
            let errorMessage = 'Unable to retrieve your location';
            if (error.code === error.PERMISSION_DENIED) {
                errorMessage = 'Location access denied. Please enable location services.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMessage = 'Location information unavailable';
            } else if (error.code === error.TIMEOUT) {
                errorMessage = 'Location request timed out';
            }
            showStatus(errorMessage, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

function findNearestStores() {
    if (!userLocation || allStores.length === 0) {
        return;
    }

    const storesWithDistance = allStores.map(store => {
        const coords = store.geometry.coordinates;
        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            coords[1],
            coords[0]
        );

        return {
            ...store,
            distance: distance
        };
    });

    const nearestStores = storesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

    displayNearestStores(nearestStores);
}

function displayNearestStores(stores) {
    const container = document.getElementById('nearest-stores');
    if (!container) return;

    container.innerHTML = '<h4 style="margin-bottom: 10px; color: var(--primary-color);">Nearest Stores:</h4>';

    stores.forEach((store, index) => {
        const props = store.properties;
        const priceTier = props.Price_Tier || props['Price Tier'] || 'Unknown';
        const tierClass = priceTier.toLowerCase().replace('-', '-');
        
        const storeDiv = document.createElement('div');
        storeDiv.className = `store-item ${tierClass}`;
        storeDiv.innerHTML = `
            <div class="store-name">${index + 1}. ${props['Trade Name'] || props.TradeName || 'Store'}</div>
            <div class="store-distance">📍 ${store.distance.toFixed(2)} miles away</div>
            <div class="store-tier ${tierClass}">${priceTier}</div>
        `;

        storeDiv.addEventListener('click', () => {
            const coords = store.geometry.coordinates;
            map.flyTo({
                center: coords,
                zoom: 15,
                duration: 1500
            });

            new mapboxgl.Popup()
                .setLngLat(coords)
                .setHTML(`
                    <strong>${props['Trade Name'] || props.TradeName || 'Store'}</strong><br>
                    ${props.Address || props['Address'] || ''}<br>
                    <em>Price Tier: ${priceTier}</em><br>
                    <strong>${store.distance.toFixed(2)} miles away</strong>
                `)
                .addTo(map);
        });

        container.appendChild(storeDiv);
    });
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('location-status');
    if (!statusDiv) return;

    statusDiv.textContent = message;
    statusDiv.className = `location-status ${type}`;

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'location-status';
        }, 5000);
    }
}
