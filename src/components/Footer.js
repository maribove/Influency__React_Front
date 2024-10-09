import './Footer.css'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import Suporte from '../pages/Suporte/Suporte';

const Footer = () => {
  return (
    <footer id='footer'>
      <p>Influency &copy; 2024</p>
      <p>
      
                <NavLink to="/suporte" className='suporte'>
                  Suporte
                </NavLink>
                </p>
    </footer>
  )
}

export default Footer
