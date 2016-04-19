var canvas = document.getElementById("canvas");
var videoElement = document.getElementById('video');
var download = document.getElementById('download');
var context = canvas.getContext("2d");

//image to video via Whammy
var video = new Whammy.Video(15);

var routeSize;
var path;
var pathSize;
var step;
var spinner;

function createVideo(route) {

    var opts = {
        lines: 7 // The number of lines to draw
        , length: 35 // The length of each line
        , width: 12 // The line thickness
        , radius: 28 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#3B9C9C' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 69 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1.6 // Rounds per second
        , trail: 21 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: true // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    };
    var target = document.getElementById('spinnerDiv');
    spinner = new Spinner(opts).spin(target);

    document.getElementById('status').innerHTML = "Generating... Please Wait.";

    videoElement.src = "";

    canvas.width = 640;
    canvas.height = 480;
    video = new Whammy.Video(5);

    routeSize = route.routes.length;
    for(var i = 0; i < route.routes.length; i++) {
        //e.log("new route direction");
        path = route.routes[i].overview_path;
        pathSize = path.length;
        step = pathSize % 100;
        console.log(step);
        loopPath(0);
    }

}

function loopPath(count) {

    var lastSpot = path[count != 0 ? count - 1 : count];
    var nextSpot = path[count != pathSize ? count + 1 : count];
    var heading = google.maps.geometry.spherical.computeHeading(lastSpot, nextSpot);

    var url = getUrl(path[count], heading);
    //console.log(count + "/" + pathSize + "processing: " + url);
    process(url, count, loopPath);
}

function getUrl(path, heading) {
    return 'http://maps.googleapis.com/maps/api/streetview?size='+canvas.width+'x'+canvas.height+'&location='
        +path.lat()+','+path.lng()+'&fov=90&heading='+heading+'&pitch=10&key=AIzaSyAANQ5ue_IV0lDKqEVm9Zg_5AlcnMWxHX0';
}

/* main process function */
function process(url, count, callback) {
    var img = new Image();

    //load image and drop into canvas
    img.onload = function() {

        //a custom fade in and out slideshow
        // context.globalAlpha = 0.2;
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);
        // context.clearRect(0,0,context.canvas.width,context.canvas.height);
        // context.globalAlpha = 0.4;
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);
        // context.clearRect(0,0,context.canvas.width,context.canvas.height);
        // context.globalAlpha = 0.6;
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);
        // context.clearRect(0,0,context.canvas.width,context.canvas.height);
        // context.globalAlpha = 0.8;
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);
        // context.clearRect(0,0,context.canvas.width,context.canvas.height);
        // context.globalAlpha = 1;

        context.globalAlpha = 0.6;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        video.add(context);
        context.globalAlpha = 1;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        //frames of solid picture
        video.add(context);
        video.add(context);

        context.globalAlpha = 0.6;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        video.add(context);
        // context.clearRect(0,0,context.canvas.width,context.canvas.height);
        // context.globalAlpha = 0.8;
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);
        // context.clearRect(0,0,context.canvas.width,context.canvas.height);
        // context.globalAlpha = 0.6;
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);
        // context.clearRect(0,0,context.canvas.width,context.canvas.height);
        // context.globalAlpha = 0.4;
        // context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);


        document.getElementById('status').innerHTML = "Generating "+count+"/"+pathSize+"... Please Wait.";
        if(count == pathSize - 2)
            finalizeVideo();
        else
            callback(count+1);
    };
    img.crossOrigin = 'Anonymous';
    img.src = url;

}


function finalizeVideo(){
    //check if its ready
    //if(pathCount == pathSize) {

    document.getElementById('status').innerHTML = "Encoding frames... Please Wait.";
    //document.getElementById('home-map').style.display = '';
    var start_time = +new Date;
    video.compile(false, function(output){
        spinner.stop();
        var end_time = +new Date;
        var url = window.URL.createObjectURL(output);
        document.getElementById('spinnerDiv').style.display = 'none';
        videoElement.src = url; //toString converts it to a URL via Object URLs, falling back to DataURL
        download.style.display = '';
        download.href = url;
        document.getElementById('status').innerHTML = "Compiled Video in " + (end_time - start_time) + "ms, file size: " + Math.ceil(output.size / 1024) + "KB";
        videoElement.style.display = '';
    });
}