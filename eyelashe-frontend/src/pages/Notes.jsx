import React from "react";

const formatDate = (isoString) =>{
    if(!isoString)return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([],
        {hour:'2-digit', minute:'2-digit'});
};

export default function Notes({ appointments, customerNotes }) {
  const today = new Date().toISOString().split('T')[0]; // "2026-05-27"

  const todayApts = appointments.filter(a =>
    (a.status === 'confirmed' || a.status === 'completed') &&
    a.datetime.startsWith(today)
  );

  const relevantNotes = customerNotes
   .map(note => {
      const apt = todayApts.find(a => a.customerId === note.customerId);
      return apt? {...note, clientName: apt.client, time: apt.time } : null;
    })
   .filter(Boolean);

  if (relevantNotes.length === 0) return null;

  return (
    <div className="staff-notes-card">
  <div className="card-header">
    <h3 className="staff-card-title">Client Notes</h3>
  </div>

  <div className="staff-notes-scroll">
    {relevantNotes.length > 0 ? (
      relevantNotes.map(n => (
        <div key={n.id} className="staff-note-item">
          <div className="staff-note-client-info">
            <span className="staff-note-client">{n.clientName}</span>
            <span className="staff-note-time">{n.time}</span>
          </div>
          <p className="staff-note-text">{n.text}</p>
        </div>
      ))
    ) : (
      <div className="empty-state">No notes for today</div>
    )}
  </div>
</div>
  );
}