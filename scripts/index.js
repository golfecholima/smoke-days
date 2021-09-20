mapboxgl.accessToken =
    "pk.eyJ1IjoiY2FsbmV3c3Jvb20iLCJhIjoiY2ttYzhwZ2wyMDVobTJwbXhiaG81bXpzdSJ9.xnkn2BlbVZvFfGukyV_-0g";

const bounds = [
    [-199.284547, 14.755733], // Southwest coordinates
    [-35.323822, 75.518426] // Northeast coordinates
];

const map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/calnewsroom/cktlz242w9m1517pf1yy878my", // replace this with your style URL
    zoom: 3, // sets initial zoom
    maxZoom: 10, // sets max zoom
    minZoom: 3, // sets min zoom
    center: [-101.41010808098838, 39.7680455941696], // sets initial center point
    maxBounds: bounds
});

map.on("load", () => {
    // legend colors and labels
    const layers = [
        "Less than 15 days",
        "15-30",
        "30-45",
        "45-60",
        "60-75",
        "75-90",
        "More than 90 days"
    ];
    const colors = [
        "rgba(255,255,0,.75)",
        "rgba(255,208,0,.75)",
        "rgba(252,159,5,.75)",
        "rgba(235,113,17,.75)",
        "rgba(209,69,25,.75)",
        "rgba(172,28,31,.75)",
        "rgba(126,0,35,.75)"
    ];
    // create legend
    const legend = document.getElementById("legend");
    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement("div");
        const key = document.createElement("span");
        key.className = "legend-key";
        key.style.backgroundColor = color;
        const value = document.createElement("span");
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });

    // Show a popup when zip codes are clicked and zoom to the area
    map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point);
        const re = RegExp('^(.*?)\,');
        

        var state = features[0].properties.state_code.toUpperCase()
        var county = features[0].properties.county.toUpperCase()
        var city = features[0].properties.city.toUpperCase()
        var zip = features[0].properties.GEOID10
        var current_smoke = features[0].properties.current_period
        var base_smoke = features[0].properties.base_period
        var pct_change = features[0].properties.pct_change

        if ((thing = re.exec(city)) !== null) {
            var city = `${thing[1]}`;
        };

        popup_html = '<h3>' + city + ', ' + state + ' ' + zip + '</h3></br>' + current_smoke + ' average smoke days 2016-2020' + '</strong></br>' + base_smoke + ' average smoke days 2009-2013' + '</br>' + pct_change + '% change';

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popup_html)
            .addTo(map);

        var zoom = map.getZoom();

        if (zoom < 7) {
            map.flyTo({
                zoom: 7,
                center: e.lngLat
            })
        } else {
            map.flyTo({
                center: e.lngLat
            })
        }

    });

    map.getCanvas().style.cursor = 'pointer'

    // Search
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            countries: 'us',
            mapboxgl: mapboxgl
        }),
        'top-left',
    );

    document.querySelector('.mapboxgl-ctrl-geocoder--input').placeholder = "State, City, Zip, Address";

    // Zoom in/out, compass, fullscreen
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'bottom-right');

    map.addControl(new mapboxgl.FullscreenControl({
        container: document.querySelector('body')
    }));

    // Geolocation option
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
    }));

    // Scale ruler
    const scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial'
    });
    map.addControl(scale);

    scale.setUnit('imperial');

    // ABOUT MODAL
    var modal = document.getElementById("modal");
    var btn = document.getElementById("modalBtn");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});

console.log("JavaScript is amazing!");