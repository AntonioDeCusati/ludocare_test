Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.ageGenderNet.loadFromUri('./assets/reko/models')
// faceLandmark68TinyNet
// ssdMobilenetv1
// tinyYolov2
]).then(startVideo)

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    video.srcObject = stream;
  })
  .catch(function (err0r) {
    console.log("Something went wrong! Error: " , err0r);
  });
}

video.addEventListener('play', () => {
  if(document.getElementById("canvasClr") != undefined){
    delete document.getElementById("canvasClr");
  }
  const canvas = faceapi.createCanvasFromMedia(video)
  canvas.style.position = "absolute";
  canvas.id= "canvasClr";
  document.getElementById('attachCanvas').append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors()
    if(detections && detections.length > 0){
      detectionsFace.innerHTML="";
      detectionsFace.value=JSON.stringify(detections);
    }
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    
  }, 150)
})
