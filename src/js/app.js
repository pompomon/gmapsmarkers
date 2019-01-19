(function () {
    let polygon = null,
        map = null,
        coordinates = [],
        markers = [];

    const mapContainerId = "map",
        modal = document.getElementById('myModal'),
        exportButton = document.querySelector(".exportButton"),
        controlTypeSelect = document.querySelector("#controlType"),
        closeButton = document.querySelector(".close"),
        _getControlType = () => controlTypeSelect.options[controlTypeSelect.selectedIndex].value,
        _isPolygonType = type => type === "polygon";

    let controlType = _getControlType();

    const _initPoly = (mapObject) => {
            const poly = new google.maps.Polyline({
                strokeColor: '#ccc',
                strokeOpacity: 1.0,
                strokeWeight: 3,
            });
            poly.setMap(mapObject);
            return poly;
        },
        _cleanMarkers = () => {
            markers.forEach((item) => {
                item.setMap(null);
            });
            markers = [];
            if (polygon) {
                polygon.setMap(null);
                polygon = null;
            }
            coordinates = [];
            if (_isPolygonType(controlType)) {
                polygon = _initPoly(map);
            }
        },
        _initExportButton = () => {
            exportButton.addEventListener('click', () => {
                modal.style.display = "block";
                modal.querySelector("#output").innerHTML = JSON.stringify(coordinates, null, '\t');
            });

            closeButton.onclick = function () {
                modal.style.display = "none";
                _cleanMarkers();
            };
        },
        _initTypeControl = () => {
            controlTypeSelect.addEventListener("change", () => {
                controlType = _getControlType();
                _cleanMarkers();
            });
        },
        _initMap = () => {
            const mapContainer = document.getElementById(mapContainerId),
                _mapClickHandler = (event) => {
                    const latitude = event.latLng.lat();
                    const longitude = event.latLng.lng();
                    let marker = null;
                    coordinates.push({
                        longitude,
                        latitude,
                    });

                    switch (controlType) {
                    case 'circle': {
                        marker = new google.maps.Circle({
                            map,
                            radius: 20,
                            center: event.latLng,
                            fillColor: '#777',
                            fillOpacity: 0.1,
                            strokeColor: '#AA0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            draggable: false, // Dragable
                            editable: true, // Resizable
                        });
                        break;
                    }
                    case 'polygon': {
                        const path = polygon.getPath();
                        path.push(event.latLng);
                        marker = new google.maps.Marker({
                            position: event.latLng,
                            title: '#' + path.getLength(),
                            map,
                        });

                        break;
                    }
                    default:
                        break;
                    }

                    if (marker) {
                        markers.push(marker);
                        google.maps.event.addListener(marker, "click", _mapClickHandler);
                    }

                    // Center of map
                    map.panTo(new google.maps.LatLng(latitude, longitude));
                };
            if (!mapContainer) {
                console.log("No map :(");
                return;
            }
            map = new google.maps.Map(mapContainer, {
                center: { lat: 50.10306146898172, lng: 14.50386467139083 },
                zoom: 17,
            });

            // Add listener
            google.maps.event.addListener(map, "click", _mapClickHandler); // end addListener

            google.maps.event.addListener(map, "rightclick", () => {
                if (_isPolygonType(controlType) && polygon && markers.length > 2) {
                    const path = polygon.getPath(),
                        firstMarker = markers[0];
                    path.push(firstMarker.position);
                }
            });
        };

    _initExportButton();
    _initTypeControl();
    global.initMap = _initMap;
}());
