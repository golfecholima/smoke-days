mapboxgl.accessToken =
    "pk.eyJ1IjoiY2FsbmV3c3Jvb20iLCJhIjoiY2ttYzhwZ2wyMDVobTJwbXhiaG81bXpzdSJ9.xnkn2BlbVZvFfGukyV_-0g";
const map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/calnewsroom/cktlz242w9m1517pf1yy878my", // replace this with your style URL
    zoom: 4, // sets initial zoom
    maxZoom: 10, // sets max zoom
    center: [-101.41010808098838, 39.7680455941696] // sets initial center point
});
map.on("load", () => {
    // legend colors and labels
    const layers = [
        "Less than 7 days",
        "7-15",
        "15-30",
        "30-45",
        "45-60",
        "60-75",
        "75-90",
        "90-105",
        "More than 105 days"
    ];
    const colors = [
        "hsla(109, 62%, 66%, 0.75)",
        "hsla(71, 83%, 63%, 0.75)",
        "hsla(53, 95%, 55%, 0.75)",
        "hsla(27, 98%, 60%, 0.75)",
        "hsla(14, 88%, 50%, 0.75)",
        "hsla(0, 97%, 42%, 0.75)",
        "hsla(336, 53%, 35%, 0.75)",
        "hsla(318, 23%, 31%, 0.75)",
        "hsla(304, 13%, 21%, 0.75)"
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
        console.log(features)
        var lon = e.point.x
        var lat = e.point.y
        var state = features[0].properties.state_code.toUpperCase()
        var county = features[0].properties.county.toUpperCase()
        var city = features[0].properties.city.toUpperCase()
        var zip = features[0].properties.GEOID10
        var smoke = features[0].properties.current_period

        popup_html = '<strong>' + zip + '</strong><br/>' + city + ', ' + state + '<br/>' + county + '<br/>' + '<strong>' + smoke + ' average smoke days' + '</strong>';

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popup_html)
            .addTo(map);

        map.flyTo({
            zoom: 7,
            center: e.lngLat
        })

    });

    map.on("mousemove", ({ point }) => {
        const smokeDays = map.queryRenderedFeatures(point, {
            layers: ["smoke-days-0"]
        });
        document.getElementById("pd").innerHTML = smokeDays.length
            ? `<h3>${smokeDays[0].properties.GEOID10}</h3><p><strong><em>${smokeDays[0].properties.current_period}</strong> average smoke days</em></p>`
            : `<p>Click on a zip code!</p>`;
    });

    map.getCanvas().style.cursor = 'pointer'
});

console.log("JavaScript is amazing!");