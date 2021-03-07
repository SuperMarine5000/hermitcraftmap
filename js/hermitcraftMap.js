var blockIcon = L.Icon.extend({
    options: {
        iconSize: [30, -1],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    }
});

var poiLayer = [];
function getPOI(mapObject) {

    // defines a global level variable with the layer group
    poiLayer = L.layerGroup();

    // sets the path for the POI json for current selected season
    poiPath = 'data/hc'+ season +'/poi.json?v=202103070442';

    // loads data from the JSON above
    var xhr = new XMLHttpRequest();
    xhr.open('GET', poiPath, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
        if (this.status == 200) {
            var file = new File([this.response], 'temp');
            var fileReader = new FileReader();
            fileReader.addEventListener('load', function () {

                // if JSON is found and loaded, loop through each of the items, running the "createMarker()" function with the POI data
                var poiData = JSON.parse(fileReader.result);
                var tempMarkers = [];
                var i;
                for (i = 0; i < poiData.length; i++) {
                    tempMarkers.push(createMarker(poiData[i]));
                }
                poiLayer.addTo(mapObject);
            });
            fileReader.readAsText(file);
        }
    }
    xhr.send();


}

var markers = []
function createMarker(markerData) {

    // defining data
    var coords = [-markerData['coordZ'], markerData['coordX']];
    var icon = new blockIcon({ iconUrl: markerData['icon_url'] });

    var popup = '<h4>' + markerData['title'] + '</h4>';
    popup += '<h6><i class="fas fa-map-marker-alt"></i> Coords:</h6>';
    popup += '<p>X: ' + markerData['coordX'];
    if (markerData['coordY']) {
        popup += '<br>Y: ' + markerData['coordY'];
    }

    popup += '<br>Z: ' + markerData['coordZ'] + '</p>';

    if (markerData['comment'] != null) {
        popup += '<h6><i class="fas fa-comment-dots"></i> Comments:</h6>';
        popup += '<p>' + markerData['comment'] + '</p>';
    }

    // actually adding marker to map

    myMarker = L.marker(coords, { icon: icon }).addTo(poiLayer);
    myMarker._id = markerData['id'];


    var myPopup = myMarker.bindPopup(popup);

    markers.push(myMarker);
    return myMarker;
    // map.addLayer(myMarker);


}

