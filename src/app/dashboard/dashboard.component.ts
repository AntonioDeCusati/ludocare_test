import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Subject, Observable, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 
  @ViewChild('detectionsFace') detectionsFace: ElementRef;

  @Input() public metadataFace : any;
  usersList: any[] = [];
  totUsers: number = 0;
  intervalTime: number = 2000;
  faces : any;
  
  subscription: Subscription;
  
  constructor(private renderer: Renderer2) { }

  ngOnInit() {

    
    
  }

  ngAfterViewInit(): void {
    
    
  }

  
}
