// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

var recordButton, stopButton, recorder;
var model;

function getModelName() {

    var modelList = document.getElementById('model_name');
    model = modelList.options[modelList.selectedIndex].text;
    console.log(model);
}
function hold_record(){
  const record_button = document.getElementById('record')
  if(record_button.id == 'record'){
    record_button.id = 'stop';
    startRecording();
  }
  else if(record_button.id == 'stop'){
    record_button.id = 'record';
    stopRecording();
  }
}

function record_init() {
  
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');
  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true, video: false
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream, {mimeType: 'video/webm;codecs=vp9'});
   // recorder = new MediaRecorder(stream);
	//console.dir(recorder.mimeType);
    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;
  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  //audio.play();
  upload(e.data);
}

function upload(blob) {
  getModelName();
  var xhr=new XMLHttpRequest();
  xhr.onload=function(e) {
  if(this.readyState == 4) {
    console.log(xhr.responseText);
    var array=JSON.parse(xhr.responseText);
    console.log(array);
    var mystring=array.message.split("result",1)[0];
    console.log(mystring); 
    var res = mystring.split("ori:",2)[1];

    document.getElementById("outputSentence").innerHTML="辨識結果:\n"+res.replaceAll(';','\n');


  } 
  };
  //xhr.open("POST","https://cors-anywhere.herokuapp.com/https://www.taiwanspeech.ilovetogether.com/tws-cgi/post_server.py",true);
  xhr.open("POST","https://www.taiwanspeech.ilovetogether.com/tws-cgi/post_server.py",true);
  //xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
  //xhr.setRequestHeader('Content-Type', 'application/json');
  var formData = new FormData();
  formData.append('src', "W")
  formData.append('mod', model)
  formData.append('file',blob)
  xhr.send(formData)
  
}
function str_handle(mystring){
  
}