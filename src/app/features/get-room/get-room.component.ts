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
    
    // Form controls for date inputs
    checkInDate = new FormControl();
    checkOutDate = new FormControl();

    constructor(route: ActivatedRoute, http: HttpClient) {
        route.params.subscribe(id => {
            this.roomId = id['id'];
            http.get(`https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${this.roomId}`).subscribe((data: any) => {
                this.roomDetails = data;
                console.log(this.roomDetails);
                
                // Parse booked dates from API response
                this.bookedDates = this.roomDetails.bookedDates.map((dateObj: any) => new Date(dateObj.date));
                console.log('Booked dates:', this.bookedDates);
            });
        });

        // Watch for check-in date changes to update check-out date filter
        this.checkInDate.valueChanges.subscribe(value => {
            if (value && this.checkOutDate.value && this.checkOutDate.value <= value) {
                this.checkOutDate.setValue(null);
            }
        });
    }

    onImageError(event: any) {
        event.target.style.display = 'none';
    }

    // Filter for check-in date: no past dates, no booked dates
    checkInDateFilter = (date: Date | null): boolean => {
        if (!date) return false;
        
        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Disable past dates
        if (date < today) return false;
        
        // Disable booked dates
        const isBooked = this.bookedDates.some(bookedDate => 
            bookedDate.toDateString() === date.toDateString()
        );
        
        return !isBooked;
    }

    // Filter for check-out date: must be after check-in, no booked dates
    checkOutDateFilter = (date: Date | null): boolean => {
        if (!date) return false;
        
        // Must have a check-in date selected first
        if (!this.checkInDate.value) return false;
        
        // Check-out must be after check-in
        const checkInDate = new Date(this.checkInDate.value);
        checkInDate.setHours(0, 0, 0, 0);
        
        if (date <= checkInDate) return false;
        
        // Disable booked dates
        const isBooked = this.bookedDates.some(bookedDate => 
            bookedDate.toDateString() === date.toDateString()
        );
        
        return !isBooked;
    }

    // Custom date class function to style calendar dates
    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Check if date is in the past
            if (cellDate < today) {
                return 'past-date';
            }
            
            // Check if date is booked
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

    // Method to handle booking
    onBookNow() {
        if (this.checkInDate.value && this.checkOutDate.value) {
            console.log('Booking from:', this.checkInDate.value, 'to:', this.checkOutDate.value);
            // Add your booking logic here
        } else {
            alert('Please select both check-in and check-out dates');
        }
    }
}