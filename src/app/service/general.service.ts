import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot, DocumentReference } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private dbPath = '/test';
  users: any = null;

  connectionDb : AngularFirestore = null;
  usersRef: AngularFirestoreCollection<any> = null;
  singleDocRef: AngularFirestoreDocument<any> = null

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

  saveLastOperation(data : any) : any {
    return new Promise<any>((resolve, reject) =>{
      this.usersRef
          .add(data)
          .then(res => {}, err => reject(err));
  });

    
  }


























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