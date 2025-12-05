mapboxgl.accessToken = 'pk.eyJ1Ijoib2Nhc3RpIiwiYSI6ImNtaGJlcHR0bzBkbHEyam9hZjUxdTN2em8ifQ.1dlbHGkcsfz7UDrymlleLA'; 

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ocasti/cmisgsuv2001a01srhaig7em9', 
    center: [-122.3321, 47.6062],
    zoom: 12
});

let activeFilters = ['Budget', 'Mid-Range', 'Premium'];

map.on('load', () => {
    map.addSource('emergency-food', {
        type: 'geojson',
        data: './asset/emergency_food.geojson'
    });

    const starSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <polygon points="12,2 15,9 22,9 17,13 19,20 12,16 5,20 7,13 2,9 9,9"
                 fill="#326dbbff" stroke="#ffffff" stroke-width="1.5"/>
      </svg>`;

    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(starSvg);
    img.onload = () => {
        if (!map.hasImage('star-icon')) map.addImage('star-icon', img);

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
        data: './asset/seattle_hoods.geojson'
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
        data: './asset/stores.geojson'
    });

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

    document.getElementById('console').addEventListener('change', (event) => {
        const category = event.target.id;

        if (event.target.checked) {
            if (!activeFilters.includes(category)) {
                activeFilters.push(category);
            }
        } else {
            const index = activeFilters.indexOf(category);
            if (index > -1) {
                activeFilters.splice(index, 1);
            }
        }

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
        
        console.log('Current active filters:', activeFilters);
        console.log('Filter expression:', filterExpression);
    });
});

map.addControl(new mapboxgl.NavigationControl());
