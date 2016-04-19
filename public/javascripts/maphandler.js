var isOutputPage = false;

//initialize map
function initMap() {
    var startElement = document.getElementById('start');
    var endElement = document.getElementById('end');
    //directions renderer
    var directionsDisplay = new google.maps.DirectionsRenderer;
    //directions service
    var directionsService = new google.maps.DirectionsService;

    //map object
    var map = new google.maps.Map(document.getElementById('home-map'), {
        zoom: 7,
        center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);

    //read directions on initialize
    // ---- probably remove this on production, inputs will be blank by default?
    calculateAndDisplayRoute(directionsService, directionsDisplay);

    //change function to update directions preview
    var onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    //start and end inputs
    startElement.addEventListener('input', onChangeHandler);
    endElement.addEventListener('input', onChangeHandler);

    //resize function for responsive map
    $(window).resize(function() {
        google.maps.event.trigger(map, "resize");
    });
}

//find the route based off our inputs
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var startElement = document.getElementById('start');
    var endElement = document.getElementById('end');

    var start = startElement.innerHTML;
    var end = endElement.innerHTML;
    if(isNullOrUndefined(start) || isNullOrUndefined(end)) {
        var start = startElement.value;
        var end = endElement.value;
    }
    console.log("getroute start: "+start);

    //gets route from directions service
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            var route = response;
            directionsDisplay.setDirections(route);
            if(isOutputPage) {
                createVideo(route);
            }
        }
    });
}

function isNullOrUndefined(object) {
    if(object == null || object == undefined || object === '')
        return true;
    return false;
}