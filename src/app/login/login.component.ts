import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from './router.animations';
import { map } from 'rxjs/operators';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
//us:admin@nesea.it
//pas:admin@nesea.it

export class LoginComponent implements OnInit {


    message: string = "";
    email: string = "";
    password: string = "";
    showError: boolean = false;
    showLoader: boolean = false;
    useLogin: boolean = true;

    constructor(public router: Router) { }

    ngOnInit() {
        document.getElementById("sidebar").hidden = true
    }

    onLoggedin(emailForm, passwordForm) {



        let email = emailForm.value ? emailForm.value : null;
        let password = passwordForm.value ? passwordForm.value : null;

        /*localStorage.setItem('isLoggedin', 'true');
            localStorage.removeItem('messageError');
            this.message = null;

            localStorage.setItem('preferenceEmail', usersLogged[i].key);
                        localStorage.setItem('preferenceUsername', usersLogged[i].username);
                        localStorage.setItem('preferenceColor', usersLogged[i].colorePreferito);
                this.router.navigateByUrl('/home');
                this.showLoader = false;*/

        if (email === environment.user && password == environment.password) {
            document.getElementById("sidebar").hidden = false;
            this.router.navigateByUrl('/dashboard');
            localStorage.setItem('isLoggedin', 'true');
        } else {
            this.message = "Credenziali Sbagliate"
            this.showError = true;
            setTimeout(()=>{
                this.showError = false;
                this.message= "";
            }, 3000)
        }



    }


    refreshButton() {
        this.message = "";
        this.showLoader = false;
        this.showError = false;
    }

    onKeydown(event, email, password) {
        if (event.keyCode == 13) {
            this.onLoggedin(email, password);
        }
    }

}
