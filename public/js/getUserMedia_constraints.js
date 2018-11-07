var vgaButton = document.querySelector("button#vga");
var qvgaButton = document.querySelector("button#qvga");
var hdButton = document.querySelector("button#hd");

var video = document.querySelector("video");

var stream = stream;

navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


function successCallback(gotStream) {
    // Make the stream available to the console for introspection
    window.stream = gotStream;
    video.src = window.URL.createObjectURL(stream);
    // Start playing video
    video.play();
}


function errorCallback(error){
    console.log("navigator.getUserMedia error: ", error);
}


var qvgaConstraints = {
    video: {
    mandatory: {
    maxWidth: 320,
    maxHeight: 240
    }
    }
    };
    // Constraints object for standard resolution video
    var vgaConstraints = {
    video: {
    mandatory: {
    maxWidth: 640,
    maxHeight: 480
    }
    }
    };
    // Constraints object for high resolution video
    var hdConstraints = {
    video: {
    mandatory: {
    minWidth: 1280,
    minHeight: 960
    }
    }
    };





function getMedia(constraints){
    if (!!stream) {
        video.src = null;
        stream.stop();
        }
        navigator.getUserMedia(constraints, successCallback, errorCallback);
        
}

qvgaButton.onclick = function(){getMedia(qvgaConstraints)};
vgaButton.onclick = function(){getMedia(vgaConstraints)};
hdButton.onclick = function(){getMedia(hdConstraints)};