import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Subject, Observable, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('detectionsFace', { static: true }) detectionsFace: ElementRef;

  @Input() public metadataFace: any;
  usersList: any[] = [];
  totUsers: number = 0;
  intervalTime: number = 2000;
  faces: any = [];

  subscription: Subscription;

  constructor(private renderer: Renderer2, private generalService: GeneralService) { }

  ngOnInit() {
    this.generalService.getUsersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(users => {
      this.faces = users;

    })


  }

  ngAfterViewInit(): void {


  }




  convertMiliseconds(miliseconds: number, format: string): number {
    let days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

    total_seconds = Math.floor(miliseconds / 1000);
    total_minutes = Math.floor(total_seconds / 60);
    total_hours = Math.floor(total_minutes / 60);
    days = Math.floor(total_hours / 24);

    seconds = total_seconds % 60;
    minutes = total_minutes % 60;
    hours = total_hours % 24;

    switch (format) {
      case 's':
        return total_seconds;
      case 'm':
        return total_minutes;
      case 'h':
        return total_hours;
      case 'd':
        return days;
    }
  };

}
