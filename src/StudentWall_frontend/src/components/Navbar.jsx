import React from 'react'
import { Link, useMatch, useResolvedPath } from '../../../../node_modules/react-router-dom/dist/index'

export const Navbar = () => {

    function NavLink({ to, children, ...props}) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: true})
        return (
            <li className={isActive ? "active" : ""}>
                <Link to={to} {...props}>
                    {children}
                </Link>
            </li>
        )
    }

    return (
        <nav>
            <Link to="/">Site Name</Link>
            <ul>
                <NavLink to="/post">Post</NavLink>
                <NavLink to="/message">Message</NavLink>
            </ul>
        </nav>
    )
}
