import { Component} from '@angular/core';
import { APIService } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private apiService: APIService) {}

  createTodo() {
    this.apiService.CreateTodo({
        name: 'Angular',
        description: 'testing'
    });
  }

}
