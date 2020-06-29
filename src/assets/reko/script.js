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
	//console.log("Db used for getting data:", dbUsed);
	refreshData();
	startVideo();
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
var currentPerson, lastPerson, lastFaceDescriptor, currentFaceDescriptor,
	faceMatcher,
	labeledDescriptors = [],
	inserted = false,
	volte = 0,
	volteVisoNonTrovato = 0,
	sessionOpened = false,
	xA, xB, xC,
	voltoSalvato = false,
	lastPrimaryEmotion,
	currentPrimaryEmotion = "",
	valuePrimaryEmotion = 0,
	isTemp = false;
Window['spinAvaiable'] = true; // utilizzate per calcolare il rate del click

function startVideo() {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (stream) {
			video.srcObject = stream;
		})
		.catch(function (err0r) {
			//console.log("Something went wrong! Error: ", err0r);
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

			// //console.log(faceFromDB);
		}
	);
}
if (video) {
	video.addEventListener('play', () => {

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
			currentPrimaryEmotion = "";
			valuePrimaryEmotion = 0;

			var detections = await faceapi.detectAllFaces(video, option).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors()
			//console.log(detections.length);
			if (detections.length === 0) {
				if (volteVisoNonTrovato > 6 && lastPerson) {
					// devo terminare la sessione dell'utente corrente
					let currentMill = new Date().getTime();
					let faceRefLast = db.collection(dbUsed).doc(lastPerson);
					faceRefLast.get()
						.then(doc => {
							if (!doc.exists) {
								console.log('No such document!');
							} else {
								let totalMillisPlay = (currentMill - doc.data().lastDetect) + doc.data().totalMillisPlay;
								let totalClick = doc.data().totalClick + Window['clickInSession'];
								faceRefLast.update({ totalMillisPlay: totalMillisPlay, totalClick: totalClick });
								let totMinCovert = convertMiliseconds(totalMillisPlay, "s")
								console.log("L' utente : " + lastPerson + " ha giocato per un totale di " + totMinCovert + " secondi")
							}
							sessionOpened = false;
							Window['clickInSession'] = 0;
							lastPerson = undefined;
							currentPrimaryEmotion = "";
							valuePrimaryEmotion = 0;
							let canvasN = document.getElementById("canvasClr");
							let ctx = canvasN.getContext('2d');
							ctx.clearRect(0, 0, canvasN.width, canvasN.height);
						})
						.catch(err => {
							console.log('Error getting document', err);
						});
				} else {
					volteVisoNonTrovato += 1;
				}
				return
			} else {
				volteVisoNonTrovato = 0;
				voltoSalvato = true;
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
					if (volte < 10) {
						console.info("Volto non riconosciuto ma non salvato, al prossimo giro lo salvo");
						volte += 1;
						voltoSalvato = true;
					} else {
						volte = 0;
						console.info("Persona sconosciuta, sto salvando tutta la faccia: ", faces[0])
						//console.log("Score: ", resizedDetections[0].detection.score)

						let tempFace = resizedDetections[0];
						if (resizedDetections[0].detection.score > 0.96 && voltoSalvato) {
							isTemp = true;
							voltoSalvato = false;
							let currentMill = new Date().getTime();
							let currentDate = new Date();
							db.collection(dbUsed).add(
								{
									id: "temp",
									age: tempFace.age,
									score: tempFace.detection.score,
									gender: tempFace.gender,
									genderProbability: tempFace.genderProbability,
									lastDetect: currentMill,
									totalMillisPlay: 0,
									totalMoney: 0,
									lastDayPlaying: currentDate,
									firstDayPlaying: currentDate,
									totDayPlaying: 1,
									descriptor: Array.from(tempFace.descriptor),
									expressions: JSON.parse(JSON.stringify(tempFace.expressions)),
									ludopatico: false,
									totalClick: 0
								}
							).then(ref => {
								//detectionsFace 
								isTemp = false;
								let faceRef = db.collection(dbUsed).doc(ref.id);
								faceRef.update({ id: ref.id, label: ref.id });
								detectionsFace.innerHTML = ref.id;
								detectionsFace.dataset['value'] = ref.id;
								voltoSalvato = true;
							});
						}
					}
				} else {
					// il viso è stato riconosciuto
					canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
					if (!isTemp) {
						drawBox.draw(canvas)
						faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
					}

					//console.log(lastPerson);

					if (!lastPerson) {
						lastPerson = bestMatch.label;
						detectionsFace.innerHTML = lastPerson ? lastPerson : "unknown";
						detectionsFace.dataset['value'] = lastPerson ? lastPerson : "unknown";
						//elimino lo spinner
						if (document.getElementById("spinner").hidden === false) {
							document.getElementById("spinner").hidden = true;
						}
					} else {

						if (lastPerson === bestMatch.label) {
							let faceRefLast = db.collection(dbUsed).doc(lastPerson);
							if (faces[0].expressions['neutral'] > '0.40' && faces[0].expressions['neutral'] < '0.90') {
								delete faces[0].expressions['neutral'];
							}
							//aggiorno solo le emozioni se l'emozione primaria cambia
							Object.keys(faces[0].expressions).forEach(doc => {
								if (faces[0].expressions[doc] > valuePrimaryEmotion) {
									valuePrimaryEmotion = faces[0].expressions[doc];
									currentPrimaryEmotion = doc;
									if (!lastPrimaryEmotion) {
										lastPrimaryEmotion === currentPrimaryEmotion
									}
								}
								//console.log(currentPrimaryEmotion)
							})
							lastPerson = bestMatch.label;

							if (!sessionOpened) {
								let currentMill = new Date().getTime();
								faceRefLast.update({ lastDetect: currentMill })
							}
							//apro Sessione
							sessionOpened = true;



							faceRefLast.get()
								.then(doc => {
									if (!doc.exists) {
										console.log('No such document!');
									} else {
										let faceRefNew = db.collection(dbUsed).doc(lastPerson);
										let lastExpressions = JSON.parse(JSON.stringify(resizedDetections[0].expressions));
										if (lastPrimaryEmotion === currentPrimaryEmotion) {
											console.log("Aggiornate emozioni sul DB");
											faceRefNew.update({ expressions: lastExpressions });
										}


									}
								})
								.catch(err => {
									console.log('Error getting document', err);
								});

						} else {
							//console.log("Persona diversa che è stata gia riconosciuta, salvo le operazioni")
							currentPrimaryEmotion = "";
							valuePrimaryEmotion = 0;
							let currentMill = new Date().getTime();
							let faceRefLast = db.collection(dbUsed).doc(lastPerson);

							faceRefLast.get()
								.then(doc => {
									if (!doc.exists) {
										console.log('No such document!');
									} else {
										let totalMillisPlay = (currentMill - doc.data().lastDetect) + doc.data().totalMillisPlay;
										let totalClick = doc.data().totalClick + Window['clickInSession'];
										faceRefLast.update({ totalMillisPlay: totalMillisPlay, totalClick: totalClick });
										let totMinCovert = convertMiliseconds(totalMillisPlay, "m")
										console.log("L' utente : " + lastPerson + " ha giocato per un totale di " + totMinCovert + " minuti")

										lastPerson = bestMatch.label;
										let faceRefNew = db.collection(dbUsed).doc(lastPerson);
										faceRefNew.update({ lastDetect: currentMill });
									}
								})
								.catch(err => {
									console.log('Error getting document', err);
								});


						}
					}


				}

			} else {
				let tempFace = resizedDetections[0];
				let currentMill = new Date().getTime();
				if (tempFace.detection.score > 0.95 && voltoSalvato) {
					voltoSalvato = false;
					db.collection(dbUsed).add(
						{
							id: "primo_viso",
							age: tempFace.age,
							descriptor: Array.from(tempFace.descriptor),
							score: tempFace.detection.score,
							expressions: JSON.parse(JSON.stringify(tempFace.expressions)),
							gender: tempFace.gender,
							genderProbability: tempFace.genderProbability,
							lastDetect: currentMill,
							totalMillisPlay: 0,
							totalMoney: 0,
							lastDayPlaying: currentDate,
							firstDayPlaying: currentDate,
							totDayPlaying: 1,
							ludopatico: false,
							totalClick: 0
						}
					).then(ref => {
						let faceRef = db.collection(dbUsed).doc(ref.id);
						faceRef.update({ id: ref.id, label: ref.id }).then(() => {
							detectionsFace.innerHTML = ref.id;
							detectionsFace.dataset['value'] = ref.id;
							lastPerson = ref.id;
							voltoSalvato = true;
						}
						);


					});
				}
			}


		}, 500) //metterò 250 forse
	})


	function convertMiliseconds(miliseconds, format) {
		var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

		total_seconds = parseInt(Math.floor(miliseconds / 1000));
		total_minutes = parseInt(Math.floor(total_seconds / 60));
		total_hours = parseInt(Math.floor(total_minutes / 60));
		days = parseInt(Math.floor(total_hours / 24));

		seconds = parseInt(total_seconds % 60);
		minutes = parseInt(total_minutes % 60);
		hours = parseInt(total_hours % 24);

		switch (format) {
			case 's':
				return total_seconds;
			case 'm':
				return total_minutes;
			case 'h':
				return total_hours;
			case 'd':
				return days;
			default:
				return { d: days, h: hours, m: minutes, s: seconds };
		}
	};


	//slotMachine
	let count = 0;
	const btnShuffle = document.querySelector('#spin');
	const casino1 = document.querySelector('#slots_a_wrapper');
	const casino2 = document.querySelector('#slots_b_wrapper');
	const casino3 = document.querySelector('#slots_c_wrapper');
	const mCasino1 = new SlotMachine(casino1, {
		active: 0,
		delay: 500
	});
	const mCasino2 = new SlotMachine(casino2, {
		active: 1,
		delay: 500
	});
	const mCasino3 = new SlotMachine(casino3, {
		active: 2,
		delay: 500
	});
	btnShuffle.addEventListener('click', () => {
		if (Window['spinAvaiable'] === true && (Window['isLudopatico'] === false || Window['isLudopatico'] === undefined)) {
			Window['spinAvaiable'] = false;
			mCasino1.shuffle();
			mCasino2.shuffle();
			mCasino3.shuffle();
			xA = mCasino1.stop();
			mCasino1.element.setAttribute("data-result", xA + 1)
			xB = mCasino2.stop();
			mCasino2.element.setAttribute("data-result", xB + 1)
			xC = mCasino3.stop();
			mCasino3.element.setAttribute("data-result", xC + 1)
		}
		setTimeout(() => {
			Window['spinAvaiable'] = true;
		}, 1200)


	});
} else {
	console.log("Video non presente")
}
