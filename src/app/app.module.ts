import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotelRoomCardComponent } from './shared/components/hotel-room-card/hotel-room-card.component';
import { GetRoomComponent } from './features/get-room/get-room.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { HotelsComponent } from './features/hotels/hotels.component';
import { RoomsComponent } from './features/rooms/rooms.component';
import { BookedRoomsComponent } from './features/booked-rooms/booked-rooms.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HotelsComponent,
    RoomsComponent,
    BookedRoomsComponent,
    FooterComponent,
    NavbarComponent,
    HotelRoomCardComponent,
    GetRoomComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
