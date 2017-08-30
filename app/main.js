require([
    "esri/Map",
    "esri/views/MapView",
    "dojo/dom",
    "dojo/domReady!"
], function(Map, MapView, dom) {
    var map = new Map({
        basemap: "streets"
    });
    var view = new MapView({
        container: "mainMap", // Reference to the scene div created in step 5
        map: map, // Reference to the map object created before the scene
        zoom: 8, // Sets zoom level based on level of detail (LOD)
        center: [26.10, 44.44] // Sets center point of view using longitude,latitude
    });
    view.ui.move("zoom", "bottom-left");
});