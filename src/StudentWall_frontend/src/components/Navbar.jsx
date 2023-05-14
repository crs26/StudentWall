import React from 'react'
import { Link, useMatch, useResolvedPath } from '../../../../node_modules/react-router-dom/dist/index'

export const Navbar = () => {

    function NavLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: true })
        return (
            <li className={`nav-item  ${isActive ? "active" : ""}`}>
                <Link to={to} {...props}>
                    {children}
                </Link>
            </li>
        )
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container d-flex justify-content-between">
                <Link to="/" className='nav-brand'>IC Freedom Wall</Link>
                <ul className="navbar-nav nav-items">
                    <NavLink to="/post">Post</NavLink>
                    <NavLink to="/message">Message</NavLink>
                </ul>
            </div>
        </nav>
    )
}
