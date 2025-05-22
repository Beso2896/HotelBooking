import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-get-room',
  standalone: false,
  templateUrl: './get-room.component.html',
  styleUrl: './get-room.component.scss'
})
export class GetRoomComponent {

    roomId: string = '';
    roomDetails: any;
    selectedImageIndex: number = 0;

    bookedDates: Date[] = [];


    constructor(route: ActivatedRoute, http: HttpClient) {
        route.params.subscribe(id => {
            this.roomId = id['id'];
            http.get(`https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${this.roomId}`).subscribe((data: any) => {
                this.roomDetails = data;
                console.log(this.roomDetails);
                

                this.bookedDates = this.roomDetails.bookedDates.map((dateObj: any) => new Date(dateObj.date));
            });
        });
    }

    onImageError(event: any) {
    event.target.style.display = 'none';
    }

    dateFilter = (date: Date | null): boolean => {
        if (!date) return false;
        

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) return false;

        return !this.bookedDates.some(bookedDate => 
            bookedDate.toDateString() === date.toDateString()
        );
    }
    


}