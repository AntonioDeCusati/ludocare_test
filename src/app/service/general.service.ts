import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { rejects } from 'assert';



@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private dbPath = '/test';
  users: any = null;

  connectionDb: AngularFirestore = null;
  usersRef: AngularFirestoreCollection<any> = null;
  singleDocRef: AngularFirestoreDocument<any> = null
  sessionActive = false;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
    this.connectionDb = db;
  }

  getUsersList(): AngularFirestoreCollection<any> {
    return this.usersRef;
  }

  /*
  {
          id: "temp",
          age: tempFace.age,
          descriptor: Array.from(tempFace.descriptor),
          score: tempFace.detection.score,
          expressions: JSON.parse(JSON.stringify(tempFace.expressions)),
          gender: tempFace.gender,
          genderProbability: tempFace.genderProbability
  }
          */

  saveLastOperation(data: any): any {
    return new Promise<any>((resolve, reject) => {
      this.usersRef
        .add(data)
        .then(res => { }, err => reject(err));
    });
  }

  addMoney(idFace: string, moneyToAdd: number): any {
    let faceRefLast = this.usersRef.doc(idFace);
    faceRefLast.get().toPromise()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          let totalMoney = doc.data().totalMoney + moneyToAdd;
          faceRefLast.update({ totalMoney: totalMoney });
        }
      }
      )

  }


  openSession(idFace: string): boolean {
    let currentMillis = new Date().getTime();

    let faceRefLast = this.usersRef.doc(idFace);
    faceRefLast.update({ lastDetect: currentMillis });

    this.sessionActive = true;
    return this.sessionActive;
  }

  closeSession(idFace: string) {
    let currentMillis = new Date().getTime();

    let faceRefLast = this.usersRef.doc(idFace);
    faceRefLast.get().toPromise()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          let totalMinutes = (currentMillis - doc.data().lastDetect) + doc.data().totalMinutes;
          faceRefLast.update({ totalMinutes: totalMinutes });
          let totMinCovert = this.convertMiliseconds(totalMinutes, "m")
          console.log("L' utente : " + doc.data().id + " ha giocato per un totale di " + totMinCovert + " minuti")

          this.sessionActive = false;
        }
      })
      .catch(err => {
        //console.log('Error getting document', err);
      });

  }


  convertMiliseconds(miliseconds : number, format : string) : number | Object{
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
      default:
        return { d: days, h: hours, m: minutes, s: seconds };
    }
  };


}


