import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { Router } from '@angular/router';
import "firebase/auth";
import "firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
/*
  const firebaseConfig = {
    apiKey: "AIzaSyA320XeyhkYwbnoTY8JS96AGYskARdmerU",
    authDomain: "ludocaredev.firebaseapp.com",
    databaseURL: "https://ludocaredev.firebaseio.com",
    projectId: "ludocaredev",
    storageBucket: "ludocaredev.appspot.com",
    messagingSenderId: "963387545552",
    appId: "1:963387545552:web:8e2155592bc078a9ba4bd5",
    measurementId: "G-BCQWPJBVFR"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  private dbPath = '/ludocaredev';
  users: any = null;
  userPreference: any = null;
  connectionDb :  = null;
  usersRef: AngularFirestoreCollection<any> = null;

  constructor( private router: Router) {
    this.usersRef = db.collection(this.dbPath);
    this.connectionDb = db;
  }

/*
  getUsersList(): AngularFirestoreCollection<any> {
    return this.usersRef;
  }

  getMaleUserU30() : AngularFirestoreCollection<any>{
    return this.connectionDb.collection( this.dbPath ,ref => ref.where("gender", '==', 1).where("age_min","==",18));    
  }


  getUserByGenderAndAgeMin(gender, age_min): AngularFirestoreCollection<any>{
    return this.connectionDb.collection( this.dbPath ,ref => ref.where("gender", '==', gender).where("age_min","==",age_min));    
  }


  getAllPeople(){

  }

  getPerson(){
    
  }

*/
  
}