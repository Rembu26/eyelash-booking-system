import React, { useEffect, useState } from "react";

function NextUpCard ({bookings,onOpenBooking}){
    const [now,setNow] = useState (new Date());

    useEffect (() => {
        const interval = setInterval(() =>
            setNow(new Date()),30000);
    return ()=> 
        clearInterval(interval);
        },[]);

        const nextBooking = bookings
        .filter(b=> new Date(b.time)> now)
        .sort ((a,b)=> new Date(a.time) - new Date(b.time))[0];

        const getTimeLabel = (date) => {
            const diffMin = Math.floor((new
                Date (date) - now) / 60000);
                if (diffMin <= 0 ) return "Starting Now";
                if (diffMin < 60) return `In ${diffMin} min`;
                return `In ${Math.floor(diffMin/60)}h ${diffMin % 60}m`
        };

        const handleClick = (id) => {
            console.log('Open booking:',id);
            onOpenBooking &&
            onOpenBooking(id);
        };

        return(
         <div 
         className={`staff-card next-up-card ${nextBooking? 'is-next' : ''}`}
         onClick={() => nextBooking && handleClick(nextBooking.id)}
         >
      <div className="card-header">
        <h3 className="staff-card-title">Next Up</h3>
      </div>

      {nextBooking? (
        <div className="next-up-content">
          <div className="next-up-time" style={{color:'#ff4fae',fontWeight:600}}
          >{getTimeLabel(nextBooking.time)}</div>
          <div className="next-up-client">{nextBooking.client}</div>
          <div className="next-up-meta">
            {nextBooking.service} • {nextBooking.duration} • {nextBooking.lashTech}
          </div>
        </div>
      ) : (
        <div className="next-up-empty">
          <p>No upcoming bookings</p>
        </div>
      )}
    </div>
  );


};

    

    
export default NextUpCard;