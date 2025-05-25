import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    allBookings: any
    public readonly API_BASE_URL = 'https://hotelbooking.stepprojects.ge/api';

    constructor(public http: HttpClient) { }

    getData(roomId: string) {
        return this.http.get(`https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${roomId}`);
    }

    getBookings(bookingId:string) {
        return this.http.get(`${this.API_BASE_URL}/Booking`).subscribe(data => {
            console.log(data);
            
        })
    }

}
