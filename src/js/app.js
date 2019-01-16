(function () {
    const coordinates = [],
        markers = [],
        mapContainerId = "map",
        modal = document.getElementById('myModal'),
        exportButton = document.querySelector(".exportButton"),
        closeButton = document.querySelector(".close"),
        _initExportButton = () => {
            exportButton.addEventListener('click', () => {
                modal.style.display = "block";
                modal.querySelector("#output").innerHTML = JSON.stringify(coordinates, null, '\t');
            });

            closeButton.onclick = function () {
                modal.style.display = "none";
                markers.forEach((item) => {
                    item.setMap(null);
                });
            };
        },
        _initMap = () => {
            const mapContainer = document.getElementById(mapContainerId);
            if (!mapContainer) {
                console.log("No map :(");
                return;
            }
            map = new google.maps.Map(mapContainer, {
                center: { lat: 50.10306146898172, lng: 14.50386467139083 },
                zoom: 17,
            });

            // Add listener
            google.maps.event.addListener(map, "click", function (event) {
                const latitude = event.latLng.lat();
                const longitude = event.latLng.lng();
                console.log(latitude + ', ' + longitude);
                coordinates.push({
                    longitude,
                    latitude,
                });

                radius = new google.maps.Circle({
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
                markers.push(radius);

                // Center of map
                map.panTo(new google.maps.LatLng(latitude, longitude));
            }); // end addListener
        };

    _initExportButton();
    global.initMap = _initMap;
}());
