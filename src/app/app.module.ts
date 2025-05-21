import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { HotelsComponent } from './features/hotels/hotels.component';
import { RoomsComponent } from './features/rooms/rooms.component';
import { BookedRoomsComponent } from './features/booked-rooms/booked-rooms.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { provideHttpClient } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotelRoomCardComponent } from './shared/components/hotel-room-card/hotel-room-card.component';

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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
