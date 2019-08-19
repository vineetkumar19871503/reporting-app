import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import HomePageLogo from '../../assets/img/home-page-logo.jpg';
// import { Z_BLOCK } from 'zlib';
const Header = (props) => {


    return (
        <div className="home">
            <div className="pad20">
                <div className="inlineDisplay">
                    <Link to="/">
                        <img className="home-logo" alt="SENSA NETWORKING" src={HomePageLogo} />
                    </Link>
                </div>
                <div className="inlineDisplay marginleft35">
                    <h2>SENSA NETWORKING</h2>
                </div>
            </div>
            <div className="menus">
                <ul>
                    <li className={(props.activeClass === 'home' ? 'activeLink' : '')}><Link to="/home">Home</Link></li>
                    <li className={(props.activeClass === 'service' ? 'activeLink' : '')}><Link to="/services">Services</Link></li>
                    <li className={(props.activeClass === 'contactus' ? 'activeLink' : '')}><Link to="/contact-us">Contact Us</Link></li>
                    <li className={(props.activeClass === 'bsnl' ? 'activeLink' : '')}><Link to="/new-bsnl-connection">BSNL Connection</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </div>

        </div>

    )
}

export default Header;