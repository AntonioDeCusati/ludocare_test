import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Subject, Observable, interval, Subscription } from 'rxjs';

const video = document.getElementById('video')
var detectionsFace = document.getElementById('detectionsFace')
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @ViewChild('video') videoElement: ElementRef;
  @ViewChild('detectionsFace') detectionsFace: ElementRef;

  @Input() public height: number = 350;
  @Input() public width: number = 350;
  @Input() public subscribeCamera = true
  

  public errors: string[] = [];
  subscription: Subscription;
  intervalTime: number = 5000;
  lastFaceDescriptor : any;
  currentFaceDescriptor : any;

  constructor(private renderer: Renderer2) { }


  public ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.loadJScript()
    if (this.subscribeCamera) {
      const source = interval(this.intervalTime);
      this.subscription = source.subscribe(val => { 
        if(this.detectionsFace && this.detectionsFace.nativeElement.value && this.detectionsFace.nativeElement.value.length>0){
        //Arriva così 
        //this.detectionsFace.nativeElement.value
        let faces = JSON.parse(this.detectionsFace.nativeElement.value);
        /*console.log("Volti rilevati: ",faces.length)
        if(faces.length == 1){
          console.log("Deku is: ", faces[0].descriptor)
          if(!this.currentFaceDescriptor){
            console.info("Nessun volto in canna")
            this.currentFaceDescriptor = faces[0].descriptor;
          }else{
            console.info("E' presente un volto in canna")
            this.lastFaceDescriptor = faces[0].descriptor;
            
          }
          
        }*/
        
        
        }
      });
    }

  }

  ngOnDestroy() {
    // For method 1
    this.subscription && this.subscription.unsubscribe();
  }

  public loadJScript() {
    const scriptsArray = [
      './assets/reko/face-api.min.js',
      './assets/reko/script.js'
    ]
    for (let i = 0; i < scriptsArray.length; i++) {
      const body = <HTMLDivElement>document.body;
      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = scriptsArray[i];
      script.async = false;
      script.defer = true;
      body.appendChild(script);
    }

  }


/*
*L'elemento che viene ritornato ha questa struttura
[
   {
      "detection":{
         "_imageDims":{},
         "_score":0.9119463442246124,
         "_classScore":0.9119463442246124,
         "_className":"",
         "_box":{}
      },
      "landmarks":{
         "_imgDims":{},
         "_shift":{},
         "_positions":[]
      },
      "unshiftedLandmarks":{
         "_imgDims":{},
         "_shift":{},
         "_positions":[]
      },
      "alignedRect":{
         "_imageDims":{},
         "_score":0.9119463442246124,
         "_classScore":0.9119463442246124,
         "_className":"",
         "_box":{}
      },
      "expressions":{
         "neutral":0.9825541973114014,
         "happy":0.000782362709287554,
         "sad":0.008716258220374584,
         "angry":0.0027394951321184635,
         "fearful":0.00006848552584415302,
         "disgusted":0.00003461333108134568,
         "surprised":0.00510454410687089
      },
      "gender":"male",
      "genderProbability":0.9814203381538391,
      "age":34.503570556640625,
      "descriptor":{}
   }
]
*/
  
}
