export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  floor: string;
}

export interface BookingResponse {
  id: number;
  time: string;
  roomName: string;
  reservedBy: string;
  reason: string;
}

export interface CreateBookingRequest {
  roomId: string;
  date: string; 
  timeSlot: string; 
}