import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNav from './components/Navigation/MainNav';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId});
    console.log("LOGIN...\ntoken:" + this.state.token + "\nuserid:" + this.state.userId);
  };

  logout = () => {
    this.setState({token: null, userId: null});
    console.log("LOGOUT...\ntoken:" + this.state.token + "\nuserid:" + this.state.userId);
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          {/* this lets us set the value of the auth context, which will be sent down to all wrapped children*/}
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
            <MainNav/>
            <main className={'main-content'}>
              {/* only events route is available if not logged in -->*/}
              <Switch>
                <Route path={"/events"} component={EventsPage}/>
                {!this.state.token && <Route path={"/auth"} component={AuthPage}/>}
                {this.state.token && <Route path={"/bookings"} component={BookingsPage}/>}
                {!this.state.token && <Redirect to="/auth" exact/>}
                {this.state.token && <Redirect from={"/"} to="/events" exact/>}
                {this.state.token && <Redirect from={"/auth"} to="/events" exact/>}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
