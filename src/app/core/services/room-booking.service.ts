import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/enviroments';
import { BookingResponse, CreateBookingRequest, Room } from '../models/booking.model';


@Injectable({ providedIn: 'root' })
export class RoomBookingService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  getBookingsByDate(date: string): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/bookings/${date}`);
  }

  getAvailableRooms(date: string, slot: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms/available?date=${date}&slot=${slot}`);
  }

  createBooking(request: CreateBookingRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, request);
  }
}