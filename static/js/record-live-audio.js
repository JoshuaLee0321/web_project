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
  navigator.mediaDevices.getUserMedia({
    audio: true, video:false
  })
  .then(function(stream){
    recorder = new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'});
    recorder.addEventListener('dataavailable',onRecordingReady)
  })
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
function click_disappear(){
  record_btn = document.getElementById('record');
  stop_btn = document.getElementById('stop');
  record_text = document.getElementById("record_text");
  stop_text = document.getElementById('stop_text');
  if(record_btn.style.display =="none"){
    record_btn.style.display = 'flex';
    record_text.style.display = 'flex';
    stop_btn.style.display = "none";
    stop_text.style.display = "none";
  }
  else{
    record_btn.style.display = 'none';
    stop_btn.style.display = "flex";
    record_text.style.display = 'none';
    stop_text.style.display = "flex";
  }

}
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
function getJSON(){
  const node = document.createElement("option");
  
  var target = document.getElementById("model_name");

  fetch("/model_name")
  .then(function(response){
    return response.json();
  })
  .then(function(document1){

    for(i = 0;i<document1['selection'].length;i++){
      var logg = document.createElement("option");
      logg.textContent = document1['selection'][i]['opt'];
      logg.value = document1['selection'][i]['opt'];
      target.appendChild(logg);
      //到時這邊加入想要介紹的內容
      }
  })
}
function found(text,target){
  for(i = 0;i<text['selection'].length;i++){
    if(text['selection'][i]['opt'] == target){
      return i;
    }
  }
  return 0;
}
function changeModel(value){

  target = document.getElementById('model_explain');
  const js = fetch("/model_name")
  .then(function(response){
    return response.json();
  }).then(function(document){
    target.innerHTML = document['selection'][found(document,value)]['description'];
  });
}
// 下載系統
function saveTextAsFile(textToWrite, fileNameToSaveAs) {
  var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}); 
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
  // Chrome allows the link to be clicked
  // without actually adding it to the DOM.
  downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  }
  else {
  // Firefox requires the link to be added to the DOM
  // before it can be clicked.
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = destroyClickedElement;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  }
  
  downloadLink.click();
}
