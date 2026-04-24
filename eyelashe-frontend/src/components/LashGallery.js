import React  from "react";
import '../styles.css';

const lashes = [
    {
      name: "Classic",
      description: "Natural and elegant everyday look",
      image: "/images/Classic.jpg"
    },
    {
      name: "Wet",
      description: "Glossy, sleek, and spiky, designed to look like freshly coated mascara.",
      image: "/images/Wet.jpg"
    },
    {
      name: "Wispy",
      description:"Soft, feathered, and textured, with alternating lengths that create a natural yet glamorous look. ",
      image: "/images/Hybrid.jpg"
    },
    {
      name: "Anime",
      description: "Are bold, spiky, and expressive, designed to mimic the wide-eyed look of manga or anime characters.",
      image: "/images/Anime.jpg"
    },
    {
      name: "Volume",
      description: "Multiple lightweight extensions per natural lash, creating a dense, full, and fluffy effect.",
      image: "/images/Volume.jpg"
    }
  ];

function LashGallery(){
    return(
        <div className="gallery">
            {lashes.map((lash,index)=>(
                <div className="card" key={index}>
                <img src={lash.image} alt={lash.name}/>
                 
                 <div className="overlay">
                    <h3>{lash.name} Lashes</h3>
                    <p>{lash.description}</p>
                </div>

            </div>
            ))}


        </div>
    );
}
export default LashGallery;