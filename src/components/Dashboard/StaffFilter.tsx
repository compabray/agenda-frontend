// src/components/Dashboard/StaffFilter.tsx
import React from 'react';

interface Staff {
  _id: string;
  name: string;
  active: boolean;
}

interface Props {
  staff: Staff[];
  selectedStaffId: string | null;
  onStaffChange: (staffId: string | null) => void;
  showAllOption?: boolean;
}

export default function StaffFilter({ 
  staff, 
  selectedStaffId, 
  onStaffChange, 
  showAllOption = true 
}: Props) {
  const activeStaff = staff.filter(s => s.active);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por personal</h3>
      
      <div className="space-y-2">
        {showAllOption && (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="staff-filter"
              checked={selectedStaffId === null}
              onChange={() => onStaffChange(null)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-900 font-medium">
              Todo el personal
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {staff.length}
            </span>
          </label>
        )}
        
        {activeStaff.map((staffMember) => (
          <label key={staffMember._id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="staff-filter"
              checked={selectedStaffId === staffMember._id}
              onChange={() => onStaffChange(staffMember._id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-900">{staffMember.name}</span>
            </div>
          </label>
        ))}
        
        {activeStaff.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No hay personal activo disponible
          </p>
        )}
      </div>

      {staff.length > activeStaff.length && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {staff.length - activeStaff.length} miembro(s) inactivo(s) oculto(s)
          </p>
        </div>
      )}
    </div>
  );
}