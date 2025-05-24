import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Room {
  id: number;
  name: string;
  hotelId: number;
  pricePerNight: number;
  available: boolean;
  maximumGuests: number;
  roomTypeId: number;
  bookedDates: BookedDate[];
  images: RoomImage[];
}

interface BookedDate {
  id: number;
  date: string;
  roomId: number;
}

interface RoomImage {
  id: number;
  source: string;
  roomId: number;
}

interface RoomType {
  id: number;
  name: string;
}

interface FilterRequest {
  roomTypeId: number;
  priceFrom: number;
  priceTo: number;
  maximumGuests: number;
  checkIn: string;
  checkOut: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  standalone: false
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  roomTypes: RoomType[] = [];
  loading = false;
  error: string | null = null;

  // Filter form values
  selectedRoomTypeId: number = 0;
  priceFrom: number | null = null;
  priceTo: number | null = null;
  checkInDate: string = '';
  checkOutDate: string = '';

  // Date restrictions
  minDate = new Date(); // Today's date
  minCheckOutDate = new Date(); // Will be updated based on check-in date

  private readonly baseUrl = 'https://hotelbooking.stepprojects.ge/api/Rooms';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loading = true;
    this.error = null;

    // Load room types and all rooms
    Promise.all([
      this.getRoomTypes().toPromise(),
      this.getAllRooms().toPromise()
    ]).then(([roomTypes, rooms]) => {
      this.roomTypes = roomTypes || [];
      this.rooms = rooms || [];
      this.loading = false;
    }).catch(error => {
      console.error('Error loading initial data:', error);
      this.error = 'Failed to load rooms data';
      this.loading = false;
    });
  }

  private getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/GetAll`);
  }

  private getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.baseUrl}/GetRoomTypes`);
  }

  private getFilteredRooms(filterRequest: FilterRequest): Observable<Room[]> {
    return this.http.post<Room[]>(`${this.baseUrl}/GetFiltered`, filterRequest);
  }

  onCheckInDateChange(): void {
    // Update minimum checkout date to be at least one day after check-in
    if (this.checkInDate) {
      const checkInDateObj = new Date(this.checkInDate);
      this.minCheckOutDate = new Date(checkInDateObj);
      this.minCheckOutDate.setDate(checkInDateObj.getDate() + 1);
      
      // If checkout date is before the new minimum, reset it
      if (this.checkOutDate && new Date(this.checkOutDate) <= checkInDateObj) {
        this.checkOutDate = '';
      }
    } else {
      this.minCheckOutDate = new Date();
    }
  }

  onApplyFilters(): void {
    this.loading = true;
    this.error = null;

    // Always start by getting all rooms, then apply filters client-side
    this.getAllRooms().subscribe({
      next: (allRooms) => {
        console.log('All rooms response:', allRooms);
        
        let filteredRooms = allRooms;

        // Apply room type filter
        if (this.selectedRoomTypeId > 0) {
          console.log('Filtering by room type ID:', this.selectedRoomTypeId, typeof this.selectedRoomTypeId);
          console.log('Room types in data:', [...new Set(allRooms.map(r => r.roomTypeId))]);
          filteredRooms = filteredRooms.filter(room => {
            console.log(`Room ${room.name} has roomTypeId: ${room.roomTypeId} (${typeof room.roomTypeId}), selected: ${this.selectedRoomTypeId} (${typeof this.selectedRoomTypeId})`);
            const matches = Number(room.roomTypeId) === Number(this.selectedRoomTypeId);
            if (matches) {
              console.log(`✅ Room ${room.name} matches roomTypeId: ${room.roomTypeId}`);
            }
            return matches;
          });
          console.log(`After room type filter: ${filteredRooms.length} rooms found`, filteredRooms);
        }

        // Apply price filters
        if (this.priceFrom && this.priceFrom > 0) {
          filteredRooms = filteredRooms.filter(room => room.pricePerNight >= this.priceFrom!);
          console.log('After min price filter:', filteredRooms);
        }

        if (this.priceTo && this.priceTo > 0) {
          filteredRooms = filteredRooms.filter(room => room.pricePerNight <= this.priceTo!);
          console.log('After max price filter:', filteredRooms);
        }

        // Apply date availability filter
        if (this.checkInDate && this.checkOutDate) {
          filteredRooms = this.filterRoomsByAvailability(filteredRooms, this.checkInDate, this.checkOutDate);
          console.log('After availability filter:', filteredRooms);
        }

        this.rooms = filteredRooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.error = 'Failed to load rooms';
        this.loading = false;
      }
    });
  }

  private filterRoomsByAvailability(rooms: Room[], checkInDate: string, checkOutDate: string): Room[] {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    return rooms.filter(room => {
      // Check if any booked date falls within the requested date range
      const hasConflict = room.bookedDates.some(bookedDate => {
        const bookedDateObj = new Date(bookedDate.date);
        // Remove time component for date comparison
        const bookedDateOnly = new Date(bookedDateObj.getFullYear(), bookedDateObj.getMonth(), bookedDateObj.getDate());
        const checkInOnly = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
        const checkOutOnly = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());
        
        // Check if booked date falls within the stay period (inclusive of check-in, exclusive of check-out)
        return bookedDateOnly >= checkInOnly && bookedDateOnly < checkOutOnly;
      });
      
      return !hasConflict; // Return rooms that have no booking conflicts
    });
  }

  private hasAnyFilters(): boolean {
    return !!(
      this.selectedRoomTypeId > 0 ||
      this.priceFrom ||
      this.priceTo ||
      this.checkInDate ||
      this.checkOutDate
    );
  }

  private formatDateForAPI(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString();
  }

  private getDefaultCheckIn(): string {
    const today = new Date();
    return today.toISOString();
  }

  private getDefaultCheckOut(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }

  onResetFilters(): void {
    // Reset all filter values
    this.selectedRoomTypeId = 0;
    this.priceFrom = null;
    this.priceTo = null;
    this.checkInDate = '';
    this.checkOutDate = '';

    // Reset date restrictions
    this.minCheckOutDate = new Date();

    // Load all rooms again
    this.loading = true;
    this.error = null;

    this.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading all rooms:', error);
        this.error = 'Failed to load rooms';
        this.loading = false;
      }
    });
  }

  getRoomTypeName(roomTypeId: number): string {
    const roomType = this.roomTypes.find(rt => rt.id === roomTypeId);
    return roomType ? roomType.name : 'Unknown';
  }

  getMainImage(room: Room): string {
    return room.images && room.images.length > 0 
      ? room.images[0].source 
      : 'https://via.placeholder.com/300x200?text=No+Image';
  }

    getHotelName(hotelId: number): string {
    const hotelMap: { [key: number]: string } = {
        1: 'The Biltmore Hotel Tbilisi',
        2: 'Courtyard by Marriott Tbilisi',
        3: 'Radisson Blu Iveria Hotel Tbilisi',
        // Add more hotels as needed
    };
    
    return hotelMap[hotelId] || 'Hotel Name Not Available';
    }  
}