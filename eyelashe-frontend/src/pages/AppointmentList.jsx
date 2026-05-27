import React from "react";

function AppointmentsList({ appointments, onReschedule, onCancel }) {
  return (
    <>
      {appointments.map((apt) => (
        <div key={apt.id} className="staff-appointment-item">
          <div className="staff-appointment-header">
            <span className="staff-appointment-time">{apt.time}</span>
            <span className="staff-appointment-client">- {apt.client}</span>
          </div>

          <div className="staff-appointment-service">{apt.service}</div>

          {apt.status === 'confirmed' && (
            <div className="staff-appointment-status">Confirmed</div>
          )}

          <div className="staff-appointment-actions">
            {apt.status === 'confirmed' && (
              <>
                <button 
                  className="btn btn-pink" 
                  onClick={() => onReschedule(apt.id)}
                >
                  Reschedule
                </button>
                <button 
                  className="btn btn-gray" 
                  onClick={() => onCancel(apt.id)}
                >
                  Cancel
                </button>
              </>
            )}

            {apt.status === 'completed' && (
              <button className="btn btn-completed" disabled>
                <span className="icon">✓</span> Completed
              </button>
            )}

            {apt.status === 'cancelled' && (
              <button className="btn btn-cancelled" disabled>
                <span className="icon">✕</span> Cancelled
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}





export default AppointmentsList;