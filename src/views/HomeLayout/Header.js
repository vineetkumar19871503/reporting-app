import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import HomePageLogo from '../../assets/img/home-page-logo.jpg';
const Header = () => {
    return (
        <ul>
            <li><Link to="/home"><img className="home-logo" src={HomePageLogo} /></Link></li>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/new-bsnl-connection">BSNL Connection</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )
}

export default Header;