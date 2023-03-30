import './assets/css/navbar.css'

interface NavbarProps {
    openNav: () => void;
    closeNav: () => void;
}

const Navbar = ({openNav, closeNav, ...otherProps} : NavbarProps) => {
    return (
        <section id="navbar">
            <div id="navbar_background"></div>
        
            <div id="navbar_links">
                <a href="#landing_page">Home</a>
                <a href="#our_history">About</a>
                <a href="#new_products">What's new?</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#menu">Menu</a>
                <a href="#contact">Contact</a>
                <a href="#location">Location</a>
            </div>

            <div id="close_button" onClick={closeNav}>
                <div id="close_navbar_line1"></div>
                <div id="close_navbar_line2"></div>
            </div>
        </section>
    )
}

export default Navbar;