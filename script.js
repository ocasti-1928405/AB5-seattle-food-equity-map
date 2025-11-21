// 1. Add your Mapbox Access Token
mapboxgl.accessToken = 'YOUpk.eyJ1Ijoib2Nhc3RpIiwiYSI6ImNtaGJlcHR0bzBkbHEyam9hZjUxdTN2em8ifQR_MAPBOX_TOKEN_HERE'; 

// 2. Initialize the Map
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v11', 
    center: [-122.3321, 47.6062], // Seattle coordinates [lng, lat]
    zoom: 12
});


map.on('load', () => {

    // A. Add the Source (The Data)
    map.addSource('grocery-stores', {
        type: 'geojson',
        data: './mock_stores.geojson' // This points to the file  
    });

    // B. Add the Layer (The Visuals)
    map.addLayer({
        id: 'store-points',
        type: 'circle',
        source: 'grocery-stores',
        paint: {
            'circle-radius': 10, // Size of the dots
            'circle-stroke-width': 2, // White border around dots
            'circle-stroke-color': '#ffffff',
            'circle-color': [
                'match', // "Switch" statement logic
                ['get', 'Price_Tier'], // Look at the "Price_Tier" property
                'Budget', '#00FF00',   // If Budget -> GREEN
                'Mid-Range', '#FFFF00', // If Mid-Range -> YELLOW
                'Premium', '#FF0000',  // If Premium -> RED
                '#ccc' // Default color (Grey) if none match
            ]
        }
    });
});

// 4. Add Zoom Controls
map.addControl(new mapboxgl.NavigationControl());



