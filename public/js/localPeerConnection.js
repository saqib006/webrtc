// JavaScript variables holding stream and connection information
var localStream, localPeerConnection, remotePeerConnection;

// JavaScript variables associated with HTML5 video elements in the page
var localVideo = document.getElementById("localVideo");

var remoteVideo = document.getElementById("remoteVideo");
// JavaScript variables assciated with call management buttons in the page
var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

// Just allow the user to click on the Call button at start-up
startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;


// Associate JavaScript handlers with click events on the buttons
startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;


// Utility function for logging information to the JavaScript console
function log(text) {
    console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> "  + text);
}


function successCallback(stream){
    log("recieved local stream");
// Associate the local video element with the retrieved stream
    if(window.URL){
        localVideo.src = URL.createObjectURL(stream)
    }
    else{
        localVideo.src = stream
    }

    localStream = stream
// We can now enable the Call button
    callButton.disabled = false
}

function start(){
    log("requestig local stream")

    // First of all, disable the Start button on the page
startButton.disabled = true;
// Get ready to deal with different browser vendors...
navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.getUserMedia({audio:true, video:true}, successCallback, function(error){
    log("navigator.getUserMedia", error)
})

}

function call(){
    callButton.disabled = true;
    hangupButton.disabled = false;
    log("starting call")





//Note that getVideoTracks() and getAudioTracks() are not currently
//supported in Firefox...
//...just use them with Chrome

    if(navigator.webkitGetUserMedia){
        // Log info about video and audio device in use
        if(localStream.getVideoTracks().length > 0){
            log('using video device: ' + localStream.getVideoTracks()[0].label);
        }
        if(localStream.getAudioTracks().length > 0){
            log('using audio device: ' + localStream.getVideoTracks()[0].label);
        }
    }

    //chrome
    if(navigator.webkitGetUserMedia){
        RTCPeerConnection = webkitRTCPeerConnection;
        
    }

    // firefox
    if(navigator.webkitGetUserMedia){
        RTCPeerConnection = mozRTCPeerConnection;
        RTCSessionDescription = mozRTCPeerConnection;
        RTCIceCandidate = RTCIceCandidate
    }

    log("RTC peer Connection" + RTCPeerConnection)

    // This is an optional configuration string, associated with
    // NAT traversal setup

    var servers = null

    // Create the local PeerConnection object
    localPeerConnection = new RTCPeerConnection(servers)
    log("created local peer connection object local peer connection")

    // Add a handler associated with ICE protocol events

    remotePeerConnection = new RTCPeerConnection(servers)
    log("created local peer connection object remote peer connection")

    // Add a handler associated with ICE protocol events...

    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;

    // ...and a second handler to be activated as soon as the remote
    // stream becomes available.

    remotePeerConnection.onaddstream = gotRemoteStream;

    // Add the local stream (as returned by getUserMedia())
    // to the local PeerConnection.

    localPeerConnection.addStream(localStream)
    log("Added localStream to localPeerConnection");

    // We're all set! Create an Offer to be 'sent' to the callee as soon
    // as the local SDP is ready.

    localPeerConnection.createOffer(gotLocalDescription, onSignalingError);

}

function onSignalingError(error){
    console.log('faild to create signaling message: ' + error.name)
}

// Handler to be called when the 'local' SDP becomes available

function gotLocalDescription(description){
    // Add the local description to the local PeerConnection

    localPeerConnection.setLocalDescription(description)
    log("offer from local peerconnection: \n" + description.sdp);


    // ...do the same with the 'pseudoremote' PeerConnection
    // Note: this is the part that will have to be changed if you want
    // the communicating peers to become remote
    // (which calls for the setup of a proper signaling channel)

    remotePeerConnection.setRemoteDescription(description);

    // Create the Answer to the received Offer based on the 'local' description

    remotePeerConnection.createAnswer(gotRemoteDescription, onSignalingError)

}

// Handler to be called when the remote SDP becomes available

function gotRemoteDescription(description){
    // Set the remote description as the local description of the
// remote PeerConnection.

remotePeerConnection.setLocalDescription(description);
log("Answer from remotepeerconnection:\n" + description.sdp)

// Conversely, set the remote description as the remote description of the
// local PeerConnection

localPeerConnection.setRemoteDescription(description)

}

function hangup(){
    log("ending call")

    // close peerconnections
    localPeerConnection.close();
    remotePeerConnection.close();

    localPeerConnection = null;

    remotePeerConnection = null

    hangupButton.disabled = true

    callButton.disabled = false
}

// Handler to be called as soon as the remote stream becomes available

function gotRemoteStream(event){
    // Associate the remote video element with the retrieved stream
    if (window.URL) {
    // Chrome
    remoteVideo.src = window.URL.createObjectURL(event.stream);
    } else {
    // Firefox
    remoteVideo.src = event.stream;
    }
    log("Received remote stream");
    }

    // Handler to be called whenever a new local ICE candidate becomes available
function gotLocalIceCandidate(event){
    if (event.candidate) {
    // Add candidate to the remote PeerConnection
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    log("Local ICE candidate: \n" + event.candidate.candidate);
    }
    }


    // Handler to be called whenever a new remote ICE candidate becomes available
function gotRemoteIceCandidate(event){
    if (event.candidate) {
    // Add candidate to the local PeerConnection
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    log("Remote ICE candidate: \n " + event.candidate.candidate);
    }
    }