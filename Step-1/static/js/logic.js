var basemap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
  }
);

var map = L.map("map", {
  center: [
    0, 0
  ],
  zoom:3
});


basemap.addTo(map);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "grey",
      radius: getSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function markerColor(depth){
    
    
    if (depth > 20) {
        return "red";
    }
    else if (depth > 10) {
        return "orange";
    }
    else if (depth > 2) {
        return "yellow";
    }
    else {
        return "green";
    }

}

  function getSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 5;
  }


  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
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
