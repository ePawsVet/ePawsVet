import React from "react"
import { AuthProvider } from "../Contexts/AuthContext";
import Signup from "./Signup";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "../Pages/Dashboard"
import Profile from "../Pages/Profile"
import Employees from "../Pages/Employees"
import Appointments from "../Pages/Appointments"
import Contacts from "../Pages/Contacts";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard}/>
          <PrivateRoute exact path="/profile" component={Profile}/>
          <PrivateRoute exact path="/appointments" component={Appointments}/>
          <PrivateRoute exact path="/employees" component={Employees}/>
          <PrivateRoute exact path="/contacts" component={Contacts}/>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/forgot-password" component={ForgotPassword}></Route>
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
