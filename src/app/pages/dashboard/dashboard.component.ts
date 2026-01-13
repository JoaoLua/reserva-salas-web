import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MATERIAL_MODULES } from 'src/app/shared/material/material.imports';
import { ReservaComponent } from '../modais/reserva/reserva.component';
import { MatDialog } from '@angular/material/dialog';
import { RoomBookingService } from 'src/app/core/services/room-booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingResponse, CreateBookingRequest, Room } from 'src/app/core/models/booking.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ...MATERIAL_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private roomService = inject(RoomBookingService)
  private snackBar = inject(MatSnackBar)

  rooms: Room[] = []
  dataSource: BookingResponse[] = []
  selectedDate: Date = new Date()
  selectedRoom: Room | null = null;
  searchQuery: string = '';

  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['time', 'room', 'user', 'actions'];
  readonly TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    this.roomService.getBookingsByDate(formattedDate).subscribe({
      next: (data) => this.dataSource = data,
      error: () => this.snackBar.open('Erro ao carregar reservas', 'Fechar')
    });
  }

  get filteredRooms() {
    return this.rooms.filter(r =>
      r.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectRoom(room: Room) {
    this.selectedRoom = room;
  }

  isOccupied(time: string): boolean {
    return this.dataSource.some(b => b.time === time && b.roomName === this.selectedRoom?.name);
  }

  onSlotClick(time: string) {
    if (!this.selectedRoom) {
      this.snackBar.open('Selecione uma sala primeiro', 'Fechar');
      return;
    }

    const dialogRef = this.dialog.open(ReservaComponent, {
      data: { roomName: this.selectedRoom.name, time }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = [...this.dataSource, {
          id: 0, 
          time,
          roomName: this.selectedRoom!.name,
          reservedBy: result.by, 
          reason: result.reason || ''
        }];
      }
    });
  }

  cancelBooking(time: string, roomName: string) {
    if (confirm(`Deseja cancelar a reserva da ${roomName} às ${time}?`)) {
      this.dataSource = this.dataSource.filter(b => !(b.time === time && b.roomName === roomName));
    }
  }

  clearAllBookings() {
    if (confirm('Tem certeza que deseja apagar TODAS as reservas?')) {
      this.dataSource = [];
    }
  }
  // Lógica de exportação CSV portada do script.js
  exportCSV() {
    if (this.dataSource.length === 0) return;

    const headers = ["Hora;Sala;Responsável"];
    const rows = this.dataSource.map(b => `${b.time};${b.roomName};${b.reservedBy}`);
    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reservas_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
