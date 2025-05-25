import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

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
    
    
    checkInDate = new FormControl();
    checkOutDate = new FormControl();

    constructor(route: ActivatedRoute, http: HttpClient) {
        route.params.subscribe(id => {
            this.roomId = id['id'];
            http.get(`https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${this.roomId}`).subscribe((data: any) => {
                this.roomDetails = data;
                console.log(this.roomDetails);
                
                
                this.bookedDates = this.roomDetails.bookedDates.map((dateObj: any) => new Date(dateObj.date));
                console.log('Booked dates:', this.bookedDates);
            });
        });

        
        this.checkInDate.valueChanges.subscribe(value => {
            if (value && this.checkOutDate.value && this.checkOutDate.value <= value) {
                this.checkOutDate.setValue(null);
            }
        });
    }

    onImageError(event: any) {
        event.target.style.display = 'none';
    }

    
    checkInDateFilter = (date: Date | null): boolean => {
        if (!date) return false;
        
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        
        if (date < today) return false;
        
        
        const isBooked = this.bookedDates.some(bookedDate => 
            bookedDate.toDateString() === date.toDateString()
        );
        
        return !isBooked;
    }

    
    checkOutDateFilter = (date: Date | null): boolean => {
        if (!date) return false;
        
        
        if (!this.checkInDate.value) return false;
        
        
        const checkInDate = new Date(this.checkInDate.value);
        checkInDate.setHours(0, 0, 0, 0);
        
        if (date <= checkInDate) return false;
        
        
        const isBooked = this.bookedDates.some(bookedDate => 
            bookedDate.toDateString() === date.toDateString()
        );
        
        return !isBooked;
    }

    
    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            
            if (cellDate < today) {
                return 'past-date';
            }
            
            
            const isBooked = this.bookedDates.some(bookedDate => 
                bookedDate.toDateString() === cellDate.toDateString()
            );
            
            if (isBooked) {
                return 'booked-date';
            }
            
            return 'available-date';
        }
        return '';
    };

    
    onBookNow() {
        if (this.checkInDate.value && this.checkOutDate.value) {
            console.log('Booking from:', this.checkInDate.value, 'to:', this.checkOutDate.value);
            
        } else {
            alert('Please select both check-in and check-out dates');
        }
    }
}