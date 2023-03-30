/* eslint-disable*/ 
export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmljaGFyZGxnMjMxIiwiYSI6ImNsZTM1NzN3eDA1aGkzcGxkYWZuNm5lN3IifQ.u4IGO3zpucaz2DLF5e3Q5g';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/richardlg231/cle36bi5b000w01qfwald81jk',
        scrollZoom: false
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(loc => {
    //Add Marker
        const el = document.createElement('div');
        el.className = 'marker';
    
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map)
    
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
    
        bounds.extend(loc.coordinates)
    })
    
    map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 200,
        left: 200,
        right: 200
    }
    });
}


