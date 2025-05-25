import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    topRooms: any[] = [];


    constructor(private http: HttpClient, public apiService: ApiService) {
        this.http.get<any[]>('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll').subscribe(data => {
        this.topRooms = this.getTopRooms(data);
        });
    }

    
    private getTopRooms(rooms: any[]): any[] {
        return rooms
        .sort((a, b) => (b.bookedDates?.length || 0) - (a.bookedDates?.length || 0))
        .slice(0, 6);
    }
}

