import React from "react"
import { AuthProvider } from "../Contexts/AuthContext";
import Signup from "./Signup";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "../Pages/Dashboard"
//import Profile from "../Pages/Profile"
import Clients from "../Pages/Clients"
import Appointments from "../Pages/Appointments"
import Home from "../Pages/Home";
import Inventory from "../Pages/Medicines";
//import Inventory from "../Pages/Inventory";
import Reports from "../Pages/Reports";
import Message from "../Pages/Message";
import ScheduleList from "../Pages/Schedule";
import ClientProfile from "../Pages/ClientProfile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Home}/>
          <PrivateRoute exact path="/dashboard" component={Dashboard}/>
          <PrivateRoute exact path="/profile" component={ClientProfile}/>
          <PrivateRoute exact path="/inventory" component={Inventory}/>
          {/* <PrivateRoute exact path="/inventory" component={Inventory}/> */}
          <PrivateRoute exact path="/reports" component={Reports}/>
          <PrivateRoute exact path="/appointments" component={Appointments}/>
          <PrivateRoute exact path="/clients" component={Clients}/>
          <PrivateRoute exact path="/schedule" component={ScheduleList}/>
          <PrivateRoute exact path="/message" component={Message}/>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/forgot-password" component={ForgotPassword}></Route>
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
