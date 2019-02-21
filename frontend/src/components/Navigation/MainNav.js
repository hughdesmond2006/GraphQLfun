import React from 'react';
import {NavLink} from 'react-router-dom';

import './MainNav.css';      //auto processed by webpack behind the scenes
import AuthContext from '../../context/auth-context';

const mainNav = props => (
    <AuthContext.Consumer>
        {(context) => {
            return <header className={"main-nav"}>
                <div className={"main-nav__logo"}>
                    <h1>Easy Event</h1>
                </div>
                <nav className={"main-nav__items"}>
                    <ul>
                        {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                        <li><NavLink to="/events">Events</NavLink></li>
                        {context.token && (
                            <React.Fragment>
                                <li><NavLink to="/bookings">Bookings</NavLink></li>
                                <li><button onClick={context.logout}>Logout</button></li>
                            </React.Fragment>
                        )}
                    </ul>
                </nav>
            </header>
        }}
    </AuthContext.Consumer>
);

export default mainNav;