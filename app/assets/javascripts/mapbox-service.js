//= require mapbox.js

angular.module('mapbox-service', [])

.service('mapboxService', function() {
    var mapName = 'map',
        map = L.mapbox.map(mapName, 'licyeus.gg3718oi').setView([47.603569, -122.329453], 12);

    var geoJSON = {
        type: 'FeatureCollection',
        features: []
    };

    var markerLayer = L.mapbox.markerLayer();

    function clearMarkers() {
        markerLayer.clearLayers();
        geoJSON.features.length = 0;
    }

    function panTo(coordinates) {
        map.panTo([coordinates.lat, coordinates.lng]);
    }

    function addBusiness(business) {
        geoJSON.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [business.coordinates.lng, business.coordinates.lat]
            },
            properties: {
                business: business
            }
        });
        markerLayer.setGeoJSON(geoJSON);
        markerLayer.addTo(map);


        markerLayer.eachLayer(function(layer) {
            business = layer.feature.properties.business;
            var content = '<h4>' + business.name + '</h4>';
            layer.bindPopup(content);
        });
    }

    function openPopupForId(businessId) {
        markerLayer.eachLayer(function(marker) {
            if (Number(marker.feature.properties.business.id) == Number(business_id)) {
                marker.openPopup();
                panTo(marker.getLatLng());
            }
        })
    }

    return {
        clearMarkers: clearMarkers,
        panTo: panTo,
        addBusiness: addBusiness,
        openPopupForId: openPopupForId
    };
})

;