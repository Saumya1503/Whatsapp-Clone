import React from 'react'
import SignUp from "./SignUp"
import LogIn from './LogIn'
import Home from './Home'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'

function MainScreen() {

    console.log("Main Component Re render")


    return (
        <Router>
            <Switch>
                <Route path="/" exact component={LogIn} />
                <Route path="/sign-up" component={SignUp} />
                <Route path="/log-in" component={LogIn} />
                <Route path="/home" component={Home} />
            </Switch>
        </Router>
    )
}

export default MainScreen;
