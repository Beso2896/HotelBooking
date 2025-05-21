import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';



@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {
    roomId: string = '';
    
    constructor(public apiService: ApiService) {}

    getRoomsData() {
        this.apiService.getData(this.roomId).subscribe(data => {
            console.log(data);
            
        })
    }}

