import logo from './logo.svg';
import './css/App.css';
import AddOrder from './AddOrder';
import Menu from './Menu';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Login from './Login';
import NarudzbaVozac from './NarudzbaVozac';
import NarudzbeUprava from './NarudzbeUprava';
import DostaveUprava from './DostaveUprava';
import DostavaVozac from './DostavaVozac';
import Registracija from './Registracija';

const PrivateUpravaRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (!!localStorage.getItem('token') && (localStorage.getItem('idUloga')=== "3"||localStorage.getItem('idUloga')=== "1")) 
      ? <Component {...props} />
      : <Redirect to= '/menu' />
  )} />
)
const PrivateVozacRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (!!localStorage.getItem('token') && (localStorage.getItem('idUloga')=== "2"||localStorage.getItem('idUloga')=== "1")) 
      ? <Component {...props} />
      : <Redirect to= '/menu' />
  )} />
)
const PrivateAllRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (!!localStorage.getItem('token') && (localStorage.getItem('idUloga')=== "2"||localStorage.getItem('idUloga')=== "1"||localStorage.getItem('idUloga')=== "3")) 
      ? <Component {...props} />
      : <Redirect to= '/' />
  )} />
)
const PrivateAdminRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (!!localStorage.getItem('token') && (localStorage.getItem('idUloga')=== "1")) 
      ? <Component {...props} />
      : <Redirect to= '/' />
  )} />
)
function App() {
  return (
    <Router >
        <Switch>
          <PrivateUpravaRoute path="/addorder" component={AddOrder} />
          <PrivateUpravaRoute path="/narudzbeuprava" component={NarudzbeUprava} />
          <PrivateUpravaRoute path="/dostaveuprava" component={DostaveUprava} />
          <PrivateVozacRoute path="/narudzbavozac" component={NarudzbaVozac}/>
          <PrivateVozacRoute path="/dostavavozac" component={DostavaVozac}/>
          <PrivateAllRoute path="/menu" component={Menu}/>
          <PrivateAdminRoute path="/registracija" component={Registracija}/>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
    </Router>
  );
}
//window.addEventListener("beforeunload", () => localStorage.clear());

export default App;
