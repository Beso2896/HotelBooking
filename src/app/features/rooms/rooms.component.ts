import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {
  rooms: any[] = [];

  constructor(private http: HttpClient) {
    this.http.get<any[]>('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll')
      .subscribe(data => {
        console.log(data);
        this.rooms = data;
      });
  }
}
