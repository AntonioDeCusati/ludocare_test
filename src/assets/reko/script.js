Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.ageGenderNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/reko/models')
  // faceLandmark68TinyNet
  // tinyYolov2
]).then(()=>{
  console.log(dbUsed)
  allFaces = db.collection(dbUsed).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data()
      data.descriptor = Float32Array.from(doc.data().descriptor)
      var labeled = new faceapi.LabeledFaceDescriptors(data.id, [data.descriptor] )
      faceFromDB.push(labeled)
    });
  });
  startVideo()
})

var detenctionModel = {
  id: "string",
  age: "number",
  alignedRect: "object",
  descriptor: "array",
  detection: "object",
  expressions: "object",
  gender: "string",
  genderProbability: "number",
  landmarks: "object",
  unshiftedLandmarks: "object"
}


var option = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8, maxResults: 1 })
var currentPerson, lastPerson, lastFaceDescriptor, currentFaceDescriptor;
var faceMatcher;
var labeledDescriptors = []
var inserted = false;
var volte = 0;

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong! Error: ", err0r);
    });

}

video.addEventListener('play', () => {
  var creatoDeku = false;
  if (document.getElementById("canvasClr") != undefined) {
    delete document.getElementById("canvasClr");
  }
  //setto l'id per ripulirla
  var canvas = faceapi.createCanvasFromMedia(video)
  canvas.style.position = "absolute";
  canvas.id = "canvasClr";
  document.getElementById('attachCanvas').append(canvas)
  var displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    var detections = await faceapi.detectAllFaces(video, option).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors()
    if (detections && detections.length > 0) {
      detectionsFace.innerHTML = "";
      detectionsFace.value = JSON.stringify(detections);
    }
    if (!detections.length) {
      return
    }
    let faces = detections;
    var faceMatcher = new faceapi.FaceMatcher(faceFromDB, 0.6)

    var resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)


    var bestMatch = faceMatcher.findBestMatch(faces[0].descriptor)
    if(bestMatch.label === "unknown"){
      console.info("Persona sconosciuta, la sto salvando tutta la faccia: ", faces[0])
      db.collection('test').add({
        id:"temp"
      }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        let faceRef = db.collection('test').doc(ref.id);
        faceRef.update({id: ref.id, label: ref.id});
      });

    }


    var box = resizedDetections[0].detection.box
    var drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.label })
    drawBox.draw(canvas)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


    
    if (faces.length == 1) {
      this.currentFaceDescriptor = faces[0].descriptor;
    }


  }, 1500)
})
