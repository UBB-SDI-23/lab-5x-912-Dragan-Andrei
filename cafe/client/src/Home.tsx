// css
import './assets/css/home.css'

// images
import logo from './assets/images/top_part_logo.png'
import facebook from './assets/images/facebook.png'
import twitter from './assets/images/twitter.png'
import instagram from './assets/images/instagram.png'
import coffee_header from './assets/images/coffee_header.png'

// react components
import HomeNavbar from './ExpandedNavbar'

// utils
import { useState } from 'react'

const Home = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)

  const openNav = () => {
    setIsNavbarOpen(true)
  }

  const closeNav = () => {
    setIsNavbarOpen(false)
  }

  return (
    <>
      {isNavbarOpen ? <HomeNavbar openNav={openNav} closeNav={closeNav} /> : null}

      <section id="landing_page">
        <div id="gradient_effect"></div>
        <div id="actual_image">
          <div className="actual_image_inside" id="actual_image_inside1"></div>
          <div className="actual_image_inside" id="actual_image_inside2"></div>
          <div className="actual_image_inside" id="actual_image_inside3"></div>
          <div className="actual_image_inside" id="actual_image_inside4"></div>
        </div>

        <div id="landing_top_part">
          <div id="open_nav" onClick={() => openNav()}>
            <div id="line1"></div>
            <div id="line2"></div>
            <div id="line1"></div>
          </div>

          <div id="logo_div">
            <img src={logo} alt="logo" />
          </div>
        </div>

        <div id="landing_text">
          <h1>Welcome</h1>
          <p>
            Come experience exceptional coffee, where the finest ingredients are expertly 
            crafted into rich and flavorful brews, served in a cozy ambiance.
          </p>
        </div>

        <div onClick={() => openNav()} id="scroll_down">
          <a href="#">
            <div id="rounded_border_square">
              <div id="circle_inside"></div>
            </div>
          </a>
          <h1>find more</h1>
        </div>

        <div id="landing_counter">
          <div id="landing_counter_line"></div>
          <div id="circles_counter">
            <div className="circle" id="circle1"></div>
            <div className="circle" id="circle2"></div>
            <div className="circle" id="circle3"></div>
            <div className="circle" id="circle4"></div>
          </div>
          <div id="landing_counter_line"></div>
        </div>

        <div id="behind_header">
          <img src={coffee_header} alt="coffee" />
        </div>

        <div id="landing_connection_line">
          <div id="landing_connection_line_head"></div>
        </div>

        <div id="social_media">
          <a href="#">
            <img src={facebook} alt="facebook page" />
          </a>
          <a href="#">
            <img src={instagram} alt="instagram page" />
          </a>
          <a href="#">
            <img src={twitter} alt="twitter page" />
          </a>
        </div>
      </section>
    </>
  );
};

export default Home;
