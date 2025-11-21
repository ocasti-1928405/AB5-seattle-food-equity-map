// 1. Add your Token
mapboxgl.accessToken = 'pk.eyJ1Ijoib2Nhc3RpIiwiYSI6ImNtaGJlcHR0bzBkbHEyam9hZjUxdTN2em8ifQ.1dlbHGkcsfz7UDrymlleLA'; // <--- PASTE YOUR TOKEN HERE

// 2. Initialize Map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-122.3321, 47.6062],
    zoom: 12
});

// Define the starting filter list
// We want all three to be visible when the map loads
let activeFilters = ['Budget', 'Mid-Range', 'Premium'];

map.on('load', () => {
    // Load the Mock Data
    map.addSource('grocery-stores', {
        type: 'geojson',
        data: './mock_stores.geojson'
    });

    // Add the Layer
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
                'Budget', '#00FF00',    // Green
                'Mid-Range', '#FFFF00', // Yellow
                'Premium', '#FF0000',   // Red
                '#ccc' // Default
            ]
        }
    });

    // Add the Checkbox Logic 
    document.getElementById('console').addEventListener('change', (event) => {
        
        const category = event.target.id; // e.g., "Budget"
        
        // If checked, add it to the list
        if (event.target.checked) {
            if (!activeFilters.includes(category)) {
                activeFilters.push(category);
            }
        } 
        // If unchecked, remove it from the list
        else {
            const index = activeFilters.indexOf(category);
            if (index > -1) {
                activeFilters.splice(index, 1);
            }
        }

        // 5. Update the Map Filter
        // This tells Mapbox: "Only show points where Price_Tier is IN this list"
        map.setFilter('store-points', ['in', 'Price_Tier', ...activeFilters]);
        
        console.log('Current active filters:', activeFilters); // For debugging
    });
});

map.addControl(new mapboxgl.NavigationControl());