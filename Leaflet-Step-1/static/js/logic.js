// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/512/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  accessToken: API_KEY
});

lightmap.addTo(myMap);

function markerSize(magnitude) {
    let size = 0;
    if (magnitude < 1) {
        size = 10000;
    } else if (magnitude < 2) {
        size = 30000;
    } else if (magnitude < 3) {
        size = 50000;
    } else if (magnitude < 4) {
        size = 70000;
    } else if (magnitude < 5) {
        size = 90000;
    } else {
        size = 110000;
    }
    return size;
}

function markerColor(magnitude) {
    let color = "#E0736F";
    if (magnitude < 1) {
        color = "#C4F069";
    } else if (magnitude < 2) {
        color = "#E5F16A";
    } else if (magnitude < 3) {
        color = "#EFDB67";
    } else if (magnitude < 4) {
        color = "#EBBB61";
    } else if (magnitude < 5) {
        color = "#E6AA75";
    }

    return color;
}

var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div");

    let markerColors = ["#C4F069", "#E5F16A", "#EFDB67", "#EBBB61", "#E6AA75", "#E0736F"];
    let magnitudeSizes = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"]
    var labels = [];

    markerColors.forEach(function(limit, index) {
        labels.push("<div style=\"background-color: white; padding-left: 5px; padding-right: 5px;\"><span style=\"background-color: " + markerColors[index] + "\">&nbsp;&nbsp;&nbsp;&nbsp;</span> " + magnitudeSizes[index] + "</div>");
});

div.innerHTML += labels.join("");
return div;
};

// Adding legend to the map
legend.addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) {
    let features = data.features;
    if (features && features.size != 0) {
        features.forEach(function(feature) {
            if (feature && feature.geometry && feature.geometry.coordinates && feature.properties && feature.properties) {
                let coordinates = feature.geometry.coordinates;
                let magnitude = feature.properties.mag;
                let place = feature.properties.place;
                let type = feature.properties.type;
                let time = feature.properties.time;
                let date = new Date(time);

                L.circle(coordinates.splice(0, 2).reverse(), {
                    fillOpacity: 0.5,
                    opacity: 0.5,
                    color: markerColor(magnitude),
                    fillColor: markerColor(magnitude),
                    radius: markerSize(magnitude)
                }).bindPopup("<h3>" + place + "</h3> <hr> <h4>Type: " + type + "</h4><h4>Maginitude: "+ magnitude +"</h4><h4>Time: " + date + "</h4>").addTo(myMap);
            }
        })
    }
});
