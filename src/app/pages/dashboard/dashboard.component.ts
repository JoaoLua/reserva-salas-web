import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MATERIAL_MODULES } from 'src/app/shared/material/material.imports';
import { ReservaComponent } from '../modais/reserva/reserva.component';
import { MatDialog } from '@angular/material/dialog';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  floor: string;
}
export interface Booking {
  time: string;
  roomName: string;
  by: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ...MATERIAL_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedDate: Date = new Date();
  searchQuery: string = '';
  selectedRoom: Room | null = null;

  rooms: Room[] = [
    { id: "R1", name: "Sala de Reunião 1", capacity: 8, type: "Reunião", floor: "1º andar" },
    { id: "R2", name: "Sala de Reunião 2", capacity: 12, type: "Reunião", floor: "2º andar" },
    { id: "LAB", name: "Laboratório", capacity: 20, type: "Aula", floor: "Térreo" },
    { id: "AUD", name: "Auditório", capacity: 60, type: "Evento", floor: "Térreo" }
  ];

  dataSource: Booking[] = [
    { time: '09:00', roomName: 'Sala de Reunião 1', by: 'Bruno - TI' },
    { time: '14:00', roomName: 'Laboratório', by: 'Suporte - Infra' }
  ];

  displayedColumns: string[] = ['time', 'room', 'user', 'actions'];
  readonly TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  private dialog = inject(MatDialog);

  ngOnInit(): void {

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
    if (!this.selectedRoom) return;

    if (this.isOccupied(time)) {
      this.cancelBooking(time, this.selectRoom.name);
      return;
    }

    const dialogRef = this.dialog.open(ReservaComponent, {
      data: { roomName: this.selectedRoom.name, time }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = [...this.dataSource, {
          time,
          roomName: this.selectedRoom!.name,
          by: result.by
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
    const rows = this.dataSource.map(b => `${b.time};${b.roomName};${b.by}`);
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
