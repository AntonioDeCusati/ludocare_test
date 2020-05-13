import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Subject, Observable, interval, Subscription } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
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
  intervalId: number;

  constructor(private renderer: Renderer2) { }


  public ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.loadJScript()
    

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

  
}
