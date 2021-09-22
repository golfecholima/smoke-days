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
        "Less than 2 weeks",
        "2-4 weeks",
        "4-6 weeks",
        "6-8 weeks",
        "8-10 weeks",
        "10 or more weeks"
    ];
    const colors = [
        "#ffff00BF",
        "#ffc600BF",
        "#fc8900BF",
        "#f23b00BF",
        "#ad2957BF",
        "#7e0023BF"
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
        const reCDP = RegExp('( CDP)', 'g');
        const recity = RegExp('( city)', 'g');
        const retown = RegExp('( town)', 'g');
        const revill = RegExp('( village)', 'g');


        var state = features[0].properties.state_code.toUpperCase()
        var county = features[0].properties.county.toUpperCase()
        var city = features[0].properties.city
        var zip = features[0].properties.GEOID10
        var current_smoke = Math.round(features[0].properties.current_period)
        var base_smoke = Math.round(features[0].properties.base_period)
        var pct_change = Math.round(features[0].properties.pct_change)
        var color = "#000000"

        if (current_smoke <= 13.5) {
            color = "#ffff00BF";
        } else if (current_smoke >= 13.5 && current_smoke <= 27.5) {
            color = "#ffc600BF";
        } else if (current_smoke >= 27.5 && current_smoke <= 41.5) {
            color = "#fc8900BF";
        } else if (current_smoke >= 41.5 && current_smoke <= 55.5) {
            color = "#f23b00BF";
        } else if (current_smoke >= 55.5 && current_smoke <= 69.49) {
            color = "#ad2957BF";
        } else {
            color = "#7e0023BF";
        }

        if (reCDP.exec(city) !== null) {
            var city = city.replace(reCDP, '')
        };

        if (recity.exec(city) !== null) {
            var city = city.replace(recity, '')
        };

        if (retown.exec(city) !== null) {
            var city = city.replace(retown, '')
        };

        if (revill.exec(city) !== null) {
            var city = city.replace(revill, '')
        };

        popup_html = '<h3>' + state + ' - ' + zip + '</h3><p id="city" class="popup">Includes: ' + city + '</p><p class="popup"><strong>2009-2013:</strong> ' + base_smoke + ' avg. smoke days/year</p><p class="popup"><strong>2016-2020:</strong> ' + current_smoke + ' avg. smoke days/year</p><p id="pct-change" class="popup" style="border-top: 3px solid' + color + '">Percent change: ' + pct_change + '%';

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popup_html)
            .addTo(map);

        var zoom = map.getZoom();

        if (zoom < 7) {
            map.flyTo({
                zoom: 7,
                center: e.lngLat,
                offset: [0, 110]
            })
        } else {
            map.flyTo({
                center: e.lngLat,
                offset: [0, 110]
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

// Helper function
let domReady = (cb) => {
    document.readyState === 'interactive' || document.readyState === 'complete'
        ? cb()
        : document.addEventListener('DOMContentLoaded', cb);
};

domReady(() => {
    // Display body when DOM is loaded
    document.body.style.visibility = 'visible';
});

console.log("JavaScript is amazing!");