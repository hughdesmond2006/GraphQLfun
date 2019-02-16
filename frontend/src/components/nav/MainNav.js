import React from 'react';
import {NavLink} from 'react-router-dom';

import './MainNav.css';      //auto processed by webpack behind the scenes
import AuthContext from '../../context/auth-context';

const mainNav = props => (
    <AuthContext.Consumer>
        {(context) => {
            return <header className={"main-nav"}>
                <div className={"main-nav__logo"}>
                    <h1>Easy Event {console.log("MAINNAVCXT: " + JSON.stringify(context))}</h1>
                </div>
                <nav className={"main-nav__items"}>
                    <ul>
                        {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                        <li><NavLink to="/events">Events</NavLink></li>
                        {context.token && <li><NavLink to="/bookings">Bookings</NavLink></li>}
                    </ul>
                </nav>
            </header>
        }}
    </AuthContext.Consumer>
);

export default mainNav;