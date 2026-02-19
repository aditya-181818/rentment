import React from 'react'
import './Hero.css'
import Hero_pic from "../assets/Hero_pic.png";

const Hero = () => {
  return (
    
    <div className="hero">
    <div className="hero_heading1">
    </div>
    <p className="hero_para">Rent or list items like electronics, books, vehicles, tools and more.</p>

    <div className='image-container'>
        <img  src={Hero_pic} alt="HomeImg" />

    </div>
</div>
    
  )
}

export default Hero
