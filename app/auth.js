require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "esri/geometry/support/webMercatorUtils",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Legend",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
], function(
    Portal, OAuthInfo, esriId, Map, MapView, MapImageLayer, webMercatorUtils, BasemapToggle, Legend,
    domStyle, domAttr, on, dom) {
    // ArcGIS Enterprise Portals are also supported
    var portalUrl = "https://www.arcgis.com/sharing";

    // subsitute your own client_id to identify who spawned the login and check for a matching redirect URI
    var info = new OAuthInfo({
        appId: "Qgf7MKa8VTXH0WQX",
        popup: false // inline redirects don't require any additional app configuration
    });
    esriId.registerOAuthInfos([info]);

    // send users to arcgis.com to login
    on(dom.byId("btnSignIn"), "click", function() {
        esriId.getCredential(portalUrl);
    });

    on(dom.byId("btnSignOut"), "click", function() {
        esriId.destroyCredentials();
        window.location.reload();
    });

    // persist logins when the page is refreshed
    esriId.checkSignInStatus(portalUrl).then(
        function() {
            // display the map once the user is logged in
            displayMap();
        }
    );

    function displayMap() {
        var portal = new Portal();

        // Once the portal has loaded, the user is signed in
        portal.load().then(function() {
            dom.byId('viewDiv').style.display = 'block';
            dom.byId('mainMap').style.display = 'none';
            dom.byId('btnSignOut').style.display = 'block';
            dom.byId('btnSignIn').style.display = 'none';
            // dom.byId('anonymousPanel').style.display = 'none';

            var map = new Map({
                basemap: "dark-gray"
            });

            var view = new MapView({
                container: "viewDiv",
                map: map,
                zoom: 11,
                center: [26.10, 44.44],
                constraints: {
                    rotationEnabled: false
                }
            });

            var traffic = new MapImageLayer({
                url: 'https://traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer'
            })
            map.add(traffic);
            view.ui.move("zoom", "bottom-left");

            var basemapToggle = new BasemapToggle({
                view: view,
                nextBasemap: "satellite"
            });

            view.ui.add(basemapToggle, "bottom-right");

            var legend = new Legend({
                view: view,
                layerInfos: [{
                    layer: traffic,
                    title: "Legend"
                }]
            });

            view.ui.add(legend, "top-right");


            // view.on("click", function(event) {
            //     // you must overwrite default click-for-popup
            //     // behavior to display your own popup
            //     event.stopPropagation();

            //     // Get the coordinates of the click on the view
            //     var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            //     var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
            //     console.log(lat, lon);
            // });
        });
    }
});