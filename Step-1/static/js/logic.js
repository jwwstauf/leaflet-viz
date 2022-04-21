var map = L.map("map", {
  center: [
    0, 0
  ],
  zoom:3
});

var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {


  function stylin(feature) {
    return {
      opacity: .5,
      fillOpacity: .5,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "grey",
      radius: getSize(feature.properties.mag),
      weight: 0.5
    };
  }

  function getSize(magnitude) {
    if (magnitude === 0) return 1;
    return magnitude * 5;
  }

  function markerColor(depth){
       
    if (depth > 20) return "red";
    else if (depth > 10) return "orange";
    else if (depth > 2) return "yellow";
    else return "green";
}

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: stylin,
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 2, 10, 20];
    var colors = [
      "green",
      "orange",
      "yellow",
      "red"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(map);
});
