import React from "react"
import { FaTwitterSquare,FaFacebookSquare,FaInstagramSquare,FaPinterestSquare } from 'react-icons/fa';
import {RiSendPlaneFill} from 'react-icons/ri';

const Footer = () => 
<footer class="footer-container">
    <div class="bg-light py-4">
    <div class="container text-center">
        <ul class="list-inline mt-0">
        <li class="list-inline-item"><a href="#" target="_blank" title="twitter"><FaTwitterSquare size={50} style={{ fill: '#e27d60' }} /></a></li>
        <li class="list-inline-item"><a href="#" target="_blank" title="facebook"><FaFacebookSquare size={50} style={{ fill: '#e27d60' }} /></a></li>
        <li class="list-inline-item"><a href="#" target="_blank" title="instagram"><FaInstagramSquare size={50} style={{ fill: '#e27d60' }} /></a></li>
        <li class="list-inline-item"><a href="#" target="_blank" title="pinterest"><FaPinterestSquare size={50} style={{ fill: '#e27d60' }} /></a></li>
      </ul>
        <p class="text-muted mb-0">© 2021 ePaws All rights reserved.</p>
    </div>
    </div>
</footer>

export default Footer;