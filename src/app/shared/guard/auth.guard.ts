import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    userData: Observable<firebase.User>;

    constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
        this.userData = angularFireAuth.authState;
    }

    canActivate() {
        if (localStorage.getItem('isLoggedin') == "true") {
            return true;
        } else {
          localStorage.setItem('isLoggedin', 'false');
        }
        this.router.navigate(['/login']);
        return false;
    }


}
