import React from "react"
import { FaTwitterSquare,FaFacebookSquare,FaInstagramSquare,FaPinterestSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom'

const Footer = () => 
<footer className="footer-container">
    <div className="bg-light py-4">
    <div className="container text-center">
        <ul className="list-inline mt-0">
        <li className="list-inline-item"><Link to={{ pathname: "https://www.twitter.com/epawsvet" }} target="_blank" title="twitter"><FaTwitterSquare size={50} style={{ fill: '#e27d60' }} /></Link></li>
        <li className="list-inline-item"><Link to={{ pathname: "https://www.facebook.com/epawsvet" }} target="_blank" title="facebook"><FaFacebookSquare size={50} style={{ fill: '#e27d60' }} /></Link></li>
        <li className="list-inline-item"><Link to={{ pathname: "https://www.instagram.com/epawsvet_22" }} target="_blank" title="instagram"><FaInstagramSquare size={50} style={{ fill: '#e27d60' }} /></Link></li>
        <li className="list-inline-item"><Link to={{ pathname: "https://pin.it/5oHt00f" }} target="_blank" title="pinterest"><FaPinterestSquare size={50} style={{ fill: '#e27d60' }} /></Link></li>
      </ul>
        <p className="text-muted mb-0">© 2021 ePaws All rights reserved.</p>
    </div>
    </div>
</footer>

export default Footer;