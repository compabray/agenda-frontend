// src/components/BookingWidget/types.ts
export interface SlotWithStatus {
  time: string;
  available: boolean;
}

export interface AvailableResponse {
  date: string;
  staffId: string | null;
  slots: SlotWithStatus[];
}