import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booked-rooms',
  standalone: false,
  templateUrl: './booked-rooms.component.html',
  styleUrls: ['./booked-rooms.component.scss']
})
export class BookedRoomsComponent  {

    allBookings: any
    private readonly API_BASE_URL = 'https://hotelbooking.stepprojects.ge/api';

    // constructor (public http: HttpClient, apiService: ApiService) {
    //     this.http.get('`${this.API_BASE_URL}/Booking`').subscribe(data => {
    //         console.log(data);    
    //     })
    // }

}