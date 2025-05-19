import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hotel-room-card',
  standalone: false,
  templateUrl: './hotel-room-card.component.html',
  styleUrl: './hotel-room-card.component.scss'
})
export class HotelRoomCardComponent {
    @Input() imageUrl: string = 'assets/default-room.jpg';
    @Input() roomName: string = 'Standard Room';
    @Input() pricePerNight: string = '100';
    @Input() currencySymbol: string = '$';
    @Input() viewDetails: string = 'Click me';
}
