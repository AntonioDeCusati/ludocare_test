import { Component, Input, ElementRef, ViewChild, TemplateRef, QueryList, OnInit, AfterViewInit, Renderer2 } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from '../service/general.service';
import { map } from 'rxjs/operators';
import { CameraComponent } from '../camera/camera.component';
import { CountdownComponent } from 'ngx-countdown';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Template } from '@angular/compiler/src/render3/r3_ast';


Window['spinAvaiable'] = true; // utilizzate per calcolare il rate del click
@Component({
  selector: "slot-machine",
  templateUrl: `./slot-machine.component.html`,
  styleUrls: ["./slot-machine.component.scss"]
})
export class SlotMachineComponent implements AfterViewInit {
  @ViewChild("slotA", { static: false }) slotA: ElementRef;
  @ViewChild("slotB", { static: false }) slotB: ElementRef;
  @ViewChild("slotC", { static: false }) slotC: ElementRef;
  @ViewChild(CameraComponent, { static: false }) cameraComponent: CameraComponent;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  config;
  coin: number = 0;
  durationSessionConfig: number = 60; //600 = 10 min
  buttonDisable = true;
  sessionActive = false;
  counterMin = 0;
  counterSec = 0;
  lockAdmin = false;
  firstPlay = true;
  template = '<img class="custom-spinner-template" src="./assets/img/loading2.gif">';
  clickSessione = 0;
  timerAvviato = false;




  // options for slots
  opts = ["A", "B", "C", "D", "F", "G"];
  opts_img = [
    "./assets/libs/img/slot6.png",
    "./assets/libs/img/slot5.png",
    "./assets/libs/img/slot4.png",
    "./assets/libs/img/slot3.png",
    "./assets/libs/img/slot2.png",
    "./assets/libs/img/slot1.png",
  ];
  money = [
    4, 3, 2, 1, 1, 1
  ];

  constructor(private toastr: ToastrService, private generalService: GeneralService,
    private renderer: Renderer2, private spinnerService: Ng4LoadingSpinnerService) {
    this.spinnerService.show();
  }

  ngAfterViewInit() {

  }

  addCoin(coin) {
    this.coin += coin;
    this.buttonDisable = false;

    let idCurrentFace = this.cameraComponent.detectionsFace.nativeElement.dataset['value']
    if (idCurrentFace) {
      this.generalService.addMoney(idCurrentFace, coin)

      //apro sessione
      let sessionActive = this.generalService.openSession(idCurrentFace)
    }

    this._startSession(this.durationSessionConfig)


  }
  reset() {
    this.coin = 0;
    this.buttonDisable = true;
    this.lockAdmin = false;
    this.firstPlay = true;
    this.config = { leftTime: 0 }
    console.log("Non salvo il tempo trascorso per questa sessione")
  }


  spin() {
    this.clickSessione += 1;
    console.log(Window['spinAvaiable'])
    if (Window['spinAvaiable']) {
      this.spinFunc()
    }
  }

  spinFunc() {
    if (this.coin >= 1) {
      this.coin -= 1;
      this.checkWin(this.slotA, this.slotB, this.slotC)
    } else {
      this.toastr.error('Per poter continuare è necessario inserire una moneta', 'Denaro Insufficiente', {
        timeOut: 3000,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-right'
      });
      //console.log(clickSessione)
      //this.generalService.closeSession(clickSessione)
    }
    if (this.coin === 0) {
      this.buttonDisable = true;
    }
  }


  checkWin(A: ElementRef, B: ElementRef, C: ElementRef) {
    let number = 0,
      elemA = A.nativeElement.getAttribute('data-result'),
      elemB = B.nativeElement.getAttribute('data-result'),
      elemC = C.nativeElement.getAttribute('data-result')

    if (elemA === elemB && elemB === elemC) {
      number = 3;
      this.addWinCoin(elemA, number);
    } else if (elemA === elemB || elemA === elemC) {
      number = 2;
      this.addWinCoin(elemA, number);
    } else if (elemB === elemC) {
      number = 2;
      this.addWinCoin(elemB, number);
    } else {
      this.buttonDisable = false;
    }

  }

  addWinCoin(elem, number) {
    console.log("Elem: ", elem);
    let moneteVinte = 0;
    const winToast = (moneteVinteToas) => {
      this.toastr.success('Hai vinto : ' + moneteVinteToas + ' monete', 'Complimenti', {
        timeOut: 2000,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-success toast-x-large",
        positionClass: 'toast-top-center'
      });
    }
    switch (elem) {
      case "6": {
        moneteVinte = 4 * number;
        winToast(moneteVinte)
        break;
      }
      case "5": {
        moneteVinte = 3 * number;
        winToast(moneteVinte)
        break;
      }
      case "4": {
        moneteVinte = 2 * number;
        winToast(moneteVinte)
        break;
      }
      case "3": {
        if (number === 3) {
          moneteVinte = 1 * number;
          winToast(moneteVinte)
        } else {
          moneteVinte = 0;
        }
        break;
      }
      case "2": {
        if (number === 3) {
          moneteVinte = 1 * number;
          winToast(moneteVinte)
        } else {
          moneteVinte = 0;
        }
        break;
      }
      case "1": {
        if (number === 3) {
          moneteVinte = 1 * number;
          winToast(moneteVinte)
        } else {
          moneteVinte = 0;
        }
        break;
      }
    }

    if (moneteVinte > 0) {
      this.coin += moneteVinte;
    } else {

    }
    Window['spinAvaiable'] = true;

  }


  _createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  _startSession(durationSession: number) {
    if (this.firstPlay) {
      this.config = { leftTime: durationSession }
      this.firstPlay = false;
    }

    if (!this.timerAvviato) {
      this.timerAvviato = true;
      setTimeout(() => {
        console.log("Chiusura obbligatoria sessione")
        this.lockAdmin = true;
        this.toastr.warning('Chiusura obbligatoria della sessione', 'Contatta l\'admin di sistema per sbloccare la slot', {
          timeOut: 5000,
          enableHtml: true,
          closeButton: true,
          toastClass: "alert alert-warning toast-x-large",
          positionClass: 'toast-top-center'
        });

        console.log(this.clickSessione)
        this.timerAvviato = false;
        //salvo tempo davanti maccchina sul db
      }, durationSession * 1000)
    }
  }


}
