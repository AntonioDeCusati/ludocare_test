Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.ageGenderNet.loadFromUri('./assets/reko/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/reko/models')
  // faceLandmark68TinyNet
  // tinyYolov2
]).then(() => {
  console.log("Db used for getting data:", dbUsed);
  refreshData();
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

function refreshData() {

  db.collection(dbUsed).get().then(
    (res) => {
      faceFromDB = [];
      res.forEach(doc => {
        var data = doc.data()
        data.descriptor = Float32Array.from(doc.data().descriptor)
        var labeled = new faceapi.LabeledFaceDescriptors(data.id, [data.descriptor])
        faceFromDB.push(labeled)
      });

      console.log(faceFromDB);
    }
  );
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
    refreshData();

    var detections = await faceapi.detectAllFaces(video, option).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors()

    if (!detections.length) {
      return
    } else {
      detectionsFace.innerHTML = "";
      detectionsFace.value = JSON.stringify(detections);
    }

    let faces = detections;
    var resizedDetections = faceapi.resizeResults(detections, displaySize)
    var box = resizedDetections[0].detection.box

    if (faceFromDB.length > 0) {
      var faceMatcher = new faceapi.FaceMatcher(faceFromDB, 0.6);
      var bestMatch = faceMatcher.findBestMatch(faces[0].descriptor);
      var drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.label })

      if (bestMatch.label === "unknown") {
        //Faccio saltare la prima volta per non creare troppi volti qualora esistesse gia
        if (volte < 3) { //futuro 8
          console.info("Volto non riconosciuto ma non salvato, al prossimo giro lo salvo");
          volte += 1;
        } else {
          volte = 0;
          console.info("Persona sconosciuta, sto salvando tutta la faccia: ", faces[0])
          console.log("Score: ", resizedDetections[0].detection.score)

          let tempFace = resizedDetections[0];
          if (resizedDetections[0].detection.score > 0.96) {
           /* db.collection(dbUsed).add(
              {
                id: "temp",
                age: tempFace.age,
                descriptor: Array.from(tempFace.descriptor),
                score: tempFace.detection.score,
                expressions: JSON.parse(JSON.stringify(tempFace.expressions)),
                gender: tempFace.gender,
                genderProbability: tempFace.genderProbability
              }
            ).then(ref => {
              console.log('Added document with ID: ', ref.id);
              let faceRef = db.collection(dbUsed).doc(ref.id);
              faceRef.update({ id: ref.id, label: ref.id });
            });*/
          }
        }
      } else {
        // il viso è stato riconosciuto



        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        drawBox.draw(canvas)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }

    } else {
      //salvo la prima faccia sul db
      console.log(faceFromDB);

      let tempFace = resizedDetections[0];
      if (tempFace.detection.score > 0.90) {
       /* db.collection(dbUsed).add(*
          {
            id: "temp",
            age: tempFace.age,
            descriptor: Array.from(tempFace.descriptor),
            score: tempFace.detection.score,
            expressions: JSON.parse(JSON.stringify(tempFace.expressions)),
            gender: tempFace.gender,
            genderProbability: tempFace.genderProbability
          }
        ).then(ref => {
          console.log('Added document with ID: ', ref.id);
          let faceRef = db.collection(dbUsed).doc(ref.id);
          faceRef.update({ id: ref.id, label: ref.id });
        });*/
      }
    }


  }, 1500) //metterò 250 forse
})
