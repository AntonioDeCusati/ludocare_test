import { Component, Input, ElementRef, ViewChild, TemplateRef, QueryList, OnInit, AfterViewInit, Renderer2 } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from '../service/general.service';
import { map } from 'rxjs/operators';
import { CameraComponent } from '../camera/camera.component';
import { CountdownComponent } from 'ngx-countdown';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Template } from '@angular/compiler/src/render3/r3_ast';


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
  durationSessionConfig : number = 600;
  buttonDisable = true;
  sessionActive = false;
  counterMin = 0;
  counterSec = 0;
  lockAdmin = false;
  firstPlay = true;
  template = '<img class="custom-spinner-template" src="./assets/img/loading2.gif">';
  


  // options for slots
  opts = ["A", "B", "C", "D", "F", "G"];
  opts_img = [
    "./assets/img/bar.png",
    "./assets/img/limone.png",
    "./assets/img/melone.png",
    "./assets/img/amarene.png",
    "./assets/img/arancia.png",
    "./assets/img/banana.png",
  ];
  money = [
    6, 4, 2, 1, 1, 1
  ];

  constructor(private toastr: ToastrService, private generalService: GeneralService,
    private renderer: Renderer2,private spinnerService: Ng4LoadingSpinnerService) {
      this.spinnerService.show();
     }

  ngAfterViewInit() {
    this.addSlots(this.slotA);
    this.addSlots(this.slotB);
    this.addSlots(this.slotC);
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
    this.buttonDisable = true;
    if (this.coin >= 1) {
      this.coin -= 1;
      this.addSlots(this.slotA);
      this.addSlots(this.slotB);
      this.addSlots(this.slotC);
      this.checkWin(this.slotA, this.slotB, this.slotC)
    } else {
      this.toastr.error('Per poter continuare è necessario inserire una moneta', 'Denaro Insufficiente', {
        timeOut: 3000,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-top-right'
      });
      //this.generalService.closeSession()
    }
    if (this.coin === 0) {
      this.buttonDisable = true;
    }
  }

  addSlots(jqo: ElementRef) {
    var ctr = Math.floor(Math.random() * this.opts.length);

    jqo.nativeElement["innerHTML"] = "";
    jqo.nativeElement.insertAdjacentHTML(
      "beforeend",
      "<div class='slot' data-element= " + this.opts_img[ctr].split("/").pop() + "><img src='" +
      this.opts_img[ctr] +
      "' style='vertical-align: super !important;border-style: none; margin-top: 2px; margin-left: -2px;'></div>"
    );
  }

  checkWin(A: ElementRef, B: ElementRef, C: ElementRef) {
    let number = 0,
      elemA = A.nativeElement.lastChild.getAttribute('data-element'),
      elemB = B.nativeElement.lastChild.getAttribute('data-element'),
      elemC = C.nativeElement.lastChild.getAttribute('data-element')

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
      case "bar.png": {
        moneteVinte = 6 * number;
        winToast(moneteVinte)
        break;
      }
      case "limone.png": {
        moneteVinte = 4 * number;
        winToast(moneteVinte)
        break;
      }
      case "melone.png": {
        moneteVinte = 2 * number;
        winToast(moneteVinte)
        break;
      }
      case "banana.png": {
        if (number === 3) {
          moneteVinte = 1 * number;
          winToast(moneteVinte)
        } else {
          moneteVinte = 0;
        }
        break;
      }
      case "arancia.png": {
        if (number === 3) {
          moneteVinte = 1 * number;
          winToast(moneteVinte)
        } else {
          moneteVinte = 0;
        }
        break;
      }
      case "amarene.png": {
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
      this.coin += moneteVinte
      this.buttonDisable = false;

    } else {
      this.buttonDisable = false;
    }

  }


  _createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  _startSession(durationSession : number){
    if (this.firstPlay) {
      this.config = { leftTime: durationSession }
      this.firstPlay = false;
    }
    setTimeout(() => {
      console.log("Chiusura obbligatoria sessione")

      //blocco tutto
      this.lockAdmin = true;

      //salvo tempo davanti maccchina sul db
    }, durationSession*1000)
  }

  
}
