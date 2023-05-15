import React, { useState, useEffect } from 'react'
import { Link, useMatch, useResolvedPath } from '../../../../node_modules/react-router-dom/dist/index'
import Identity from '../helpers/Identity'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useAuth } from '../helpers/use-auth-client'

export const Navbar = () => {
  const [showNav, setShowNav] = useState(false)
  // const [imageUrl, setImageUrl] = useState(null);

  const { whoamiActor, isAuthtenticated } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setShowNav(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    console.log('lsdfgksjhdbJKSHb', whoamiActor)
    if (isAuthtenticated) {
      whoamiActor.getUser([]).then((e) => {
        console.log(e)
      })
    } else {
      console.log('navbar', isAuthtenticated)
    }
  }, [isAuthtenticated])

  function NavLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
      <li className={`nav-item  ${isActive ? 'active' : ''}`}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    )
  }

  return (
    <nav className='navbar navbar-expand-lg'>
      <div className='container d-flex justify-content-between'>
        <div className='d-flex col-md-4'>
          <Link to='/' className='nav-brand d-flex'>
            {/* <img src='/logo2.png' className='nav-logo' /> */}
            {/* <span> */}
            IC Freedom Wall
            {/* </span> */}
          </Link>
        </div>
        <ul className='mobile-nav my-auto'>
          <li className='my-auto d-flex'>
            <GiHamburgerMenu onClick={() => { setShowNav(!showNav) }} />
          </li>
        </ul>
        <ul className={`${showNav ? 'col-12 show' : ''} navbar-nav nav-items my-auto justify-content-end`}>
          <NavLink to='/post'>Post</NavLink>
          <NavLink to='/message'>Message</NavLink>
          <Identity />
        </ul>
      </div>
    </nav>
  )
}
