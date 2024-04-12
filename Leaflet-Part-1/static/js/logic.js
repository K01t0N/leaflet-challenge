// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data);
  createFeatures(data);
});

function createFeatures(earthquakeData) {
  // Create a map object.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  let features = earthquakeData.features;
  console.log(features);

  // Loop through the cities array, and create one marker for each city object.
  for (let i = 0; i < features.length; i++) {
    let latlng = [features[i].geometry.coordinates[1],
                  features[i].geometry.coordinates[0]];

      // Conditionals for country gdp_pc
    let fill = "";
    if (features[i].geometry.coordinates[2] > 90) {
      fill = "red";
    }
    else if (features[i].geometry.coordinates[2] > 70) {
      fill = "orange";
    }
    else if (features[i].geometry.coordinates[2] > 50) {
      fill = "amber";
    }
    else if (features[i].geometry.coordinates[2] > 30) {
      fill = "yellow";
    }
    else if (features[i].geometry.coordinates[2] > 10) {
      fill = "lime";
    }
    else {
      fill = "green";
    }

    L.circle(latlng, {
      fillOpacity: 0.75,
      color: "black",
      fillColor: fill,
      // Setting our circle's radius to equal the output of our markerSize() function:
      // This will make our marker's size proportionate to its population.
      radius: features[i].properties.mag * 30000
      
    }).bindPopup(`<h3>${features[i].properties.place}</h3>\
                  <h4>Magnitude: ${features[i].properties.mag}</h3>\
                  <h4>Depth: ${features[i].geometry.coordinates[2]}</h4>\
                  <hr><p>${new Date(features[i].properties.time)}</p>`).addTo(myMap);
  }
}
