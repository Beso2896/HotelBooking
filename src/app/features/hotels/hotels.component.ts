import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-hotels',
  standalone: false,
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent implements OnInit {
    hotels: any = [];
    filteredHotels: any = [];

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    ngOnInit() {
        this.http.get('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll')
            .subscribe(data => {
                this.hotels = data;
                this.filteredHotels = data;
                console.log(data);
                
            });
    }

    getCities(): any[] {
        return [...new Set(this.hotels.map((hotel: any) => hotel.city))];
    }

    filterByCity(event: any) {
        const city = event.target.value;
        if (city) {
            this.filteredHotels = this.hotels.filter((hotel: any) => 
                hotel.city === city
            );
        } else {
            this.filteredHotels = this.hotels;
        }
    }

    viewRooms(hotelId: number) {
        this.router.navigate(['/rooms'], { queryParams: { hotelId: hotelId } });
    }
}
