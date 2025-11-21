
mapboxgl.accessToken = 'pk.eyJ1Ijoib2Nhc3RpIiwiYSI6ImNtaGJlcHR0bzBkbHEyam9hZjUxdTN2em8ifQ.1dlbHGkcsfz7UDrymlleLA'; 


const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v11', // A standard Mapbox style (we will change this later)
    center: [-122.3321, 47.6062], // Starting position [lng, lat] (Seattle)
    zoom: 11 // Starting zoom level
});

// 3. Add a navigation control (zoom buttons)
map.addControl(new mapboxgl.NavigationControl());