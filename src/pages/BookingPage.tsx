import React from 'react';
import BookingWidget from '../components/BookingWidget';
import { BUSINESS_ID } from '../constants';

export default function BookingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full  bg-white rounded-lg shadow-md p-6">
        <BookingWidget businessId={BUSINESS_ID} />
      </div>
    </div>
  );
}
