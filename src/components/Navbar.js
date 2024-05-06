import './Navbar.css'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BsHouseDoorFill, BsFillPersonFill } from 'react-icons/bs'
import { PiSignOutBold } from "react-icons/pi";
import { FaPlusCircle } from "react-icons/fa";
import { useAuth } from '../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, reset } from '../slices/authSlice'

const Navbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const { auth } = useAuth()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/login")
  }

  if (isLoginPage || isRegisterPage) {
    return null; // Não renderiza a barra de navegação
  }

  return (
    <nav id='navbar'>
      <NavLink to="/" className='brand'>
        <picture>
          <source media="(max-width:1334px)" srcSet="/logo_influency_pq.png" alt="Logo Influency" />
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
      </ul>
    </nav>
  )
}

export default Navbar
