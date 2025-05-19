import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { HotelsComponent } from './features/hotels/hotels.component';
import { RoomsComponent } from './features/rooms/rooms.component';
import { BookedRoomsComponent } from './features/booked-rooms/booked-rooms.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'hotels',
        component: HotelsComponent,
    },
    {
        path: 'rooms',
        component: RoomsComponent,
    },
    {
        path: 'booked-rooms',
        component: BookedRoomsComponent,
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
