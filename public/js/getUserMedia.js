navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


var constraints = {audio:false, video:true};
var video = document.querySelector("video");

function successCallback(stream){
    window.stream = stream;

    if(window.URL){
        video.src = window.URL.createObjectURL(stream)
    }
    else{
        video.src = stream
    }
    video.play()
}

function errorCallback(error){
    console.log("navigator get user media error", error)
}

navigator.getUserMedia(constraints, successCallback, errorCallback);