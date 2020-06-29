import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Subject, Observable, interval, Subscription, of } from 'rxjs';
import { GeneralService } from '../service/general.service';


const video = document.getElementById('video')
var detectionsFace = document.getElementById('detectionsFace')
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @ViewChild('video', {static: true}) videoElement: ElementRef;
  @ViewChild('detectionsFace', {static: true}) detectionsFace: ElementRef;

  @Input() public height: number = 350;
  @Input() public width: number = 350;
  @Input() public subscribeCamera = true
  @Output() public sessionActive = false;
  

  public errors: string[] = [];
  subscription: Subscription;
  lastFaceDescriptor : any;
  currentFaceDescriptor : any;
  intervalTime: number = 5000; //secondi tra un check sessione e l'altro
  source = interval(this.intervalTime);

  constructor(private renderer: Renderer2, private generalService : GeneralService) { }

  public ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    of(this.loadJScript()).toPromise().then( ()=>{
      this.source.subscribe(val => { 

       //Gestione sessione
       if(this.detectionsFace.nativeElement.dataset['value']){
        let dataValue = this.detectionsFace.nativeElement.dataset['value']
        if(this.lastFaceDescriptor && this.lastFaceDescriptor != dataValue){

          //this.generalService.closeSession(dataValue);
          console.log("Chiudo sessione");

        } 

        this.lastFaceDescriptor = dataValue;
        
       }
       
      })
    }
    )
    
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      // Do something with 'event'
      console.log("Partito lo stream")
    })

    
    
  }

  ngOnDestroy() {
    // For method 1
    this.subscription && this.subscription.unsubscribe();
  }

  public loadJScript() {
    const scriptsArray = [
      './assets/reko/jquery.js',
      './assets/reko/jquery-ui.js',
      './assets/reko/face-api.min.js',
      './assets/reko/script.js',
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
