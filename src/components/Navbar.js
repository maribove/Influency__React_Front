import './Navbar.css'
import React from 'react'
// components 
import { NavLink, Link } from 'react-router-dom'
// icones react
import { BsHouseDoorFill, BsFillPersonFill } from 'react-icons/bs'
import { PiSignOutBold } from "react-icons/pi";
import { FaPlusCircle } from "react-icons/fa";

// Hooks
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Redux
import {logout, reset} from '../slices/authSlice'

const Navbar = () => {

  const { auth } = useAuth()
  const { user } = useSelector((state) => state.auth)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleLogout = ()=>{
    dispatch(logout())
    dispatch(reset())

    navigate("/login")
  }


  return (
    <nav id='navbar'>
      <NavLink to="/" className='brand'>
        {/* <span>Influency</span> */}
        <picture>
          <source media="(max-width:1334px)" srcset="/logo_influency_pq.png" alt="Logo Influency" />
          <img src="/logo_influency.png" alt="Logo Influency" />
        </picture>

      </NavLink>
      <ul className='links_list'>

        {auth ? (
          <>
            <li>
              <NavLink to="/">
                <BsHouseDoorFill /> Home
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink to={`/users/${user._id}`}>
                  <FaPlusCircle /> Criar Vaga
                </NavLink>
              </li>
            )}
            
            <li>
              <NavLink to="/profile">
                <BsFillPersonFill/> Meu Perfil
              </NavLink>
            </li>

            <li>
            <span className="logout" onClick={handleLogout}><PiSignOutBold/> Sair</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">
                Entrar
              </NavLink>
            </li>

            <li>
              <NavLink to="/register">
                Cadastrar
              </NavLink>
            </li>
          </>
        )}



        {/* <li>
          <NavLink to="/about">
            Sobre nós
          </NavLink>
        </li> */}


      </ul>
    </nav>
  )
}

export default Navbar