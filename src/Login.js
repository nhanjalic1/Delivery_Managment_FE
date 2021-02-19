import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import React, { Component } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
const axios = require("axios");

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      greska: false,
      alertVisible: false,
      alertMessage: "",
      alertColor: "",
    };
    this.passwordRef = React.createRef();

    this.submit = this.submit.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }
  username = "";
  password = "";
  render() {
    if (this.state.redirect) {
      return <Redirect to="/menu" />;
    }
    return (
      <Container>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>{"Prijava korisnika"}</Navbar.Brand>
        </Navbar>
        <br />
        <Container>
          <Alert variant={this.state.alertColor} dismissible show={this.state.alertVisible} onClose={this.toggle}>
            {this.state.alertMessage}
          </Alert>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Korisničko ime</Form.Label>
              <Form.Control autoFocus={true} onChange={this.changeUsername} type="text" placeholder="Unesite korisničko ime" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control ref={this.passwordRef} onChange={this.changePassword} type="password" placeholder="Unesite lozinku" />
              {this.state.greska && <Form.Text className="text-muted">Uneseni pristupni podaci nisu ispravni. Molimo vas da ponovo unesete vaše podatke.</Form.Text>}
            </Form.Group>
            <Button href="#" onClick={this.submit} variant="primary" type="submit">
              Potvrdi
            </Button>
          </Form>
        </Container>
      </Container>
    );
  }
  componentDidMount() {
    document.addEventListener("keydown", this.keyPress);
    /*
    axios
      .delete("https://localhost:3010/logout", {
        token: localStorage.getItem("refresh_token"),
      })
      .then(() => {
        console.log("obrisani");
      })
      .catch((err) => {
        console.log(err);
      });
      */

    localStorage.clear();
  }
  submit() {
    this.passwordRef.current.value = "";
    this.passwordRef.current.focus();
    this.checkCredentials();
    //this.setState({redirect:true})
    //console.log(this.passwordStrength(this.password));
    /*this.setState({greska:true});
        this.passwordRef.current.value='';
        this.passwordRef.current.focus();*/
  }
  changeUsername(a) {
    this.username = a.target.value;
  }
  changePassword(a) {
    this.password = a.target.value;
  }
  keyPress(e) {
    if (e.key == "Enter") {
      this.submit();
    }
  }
  //funkcija za snagu passworda
  //jaki: 3 vrste znakova, više od 16 znakova (2)
  //srednji: 2 vrste znakova, vise od 12 znakova (1)
  //slabi: 1 vrsta, manje od 12 znakova (0)
  passwordStrength(pass) {
    if (pass.length < 12) return 0;
    let vrste = 0;
    for (let i = 0; i < pass.length; i++) {
      if (pass[i] == pass[i].toUpperCase()) {
        vrste++;
        break;
      }
    }
    for (let i = 0; i < pass.length; i++) {
      if (pass[i] == pass[i].toLowerCase()) {
        vrste++;
        break;
      }
    }
    for (let i = 0; i < pass.length; i++) {
      if (!isNaN(pass[i] * 1)) {
        vrste++;
        break;
      }
    }
    if (vrste > 2 && pass.length > 15) return 2;
    return 1;
  }
  checkCredentials() {
    // var correct=true;
    const instance = axios.create();
    instance
      .post(
        "/login",
        {
          username: this.username,
          password: this.password,
        },
        {
          /*headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }*/
        }
      )
      .then((tokeni) => {
        localStorage.setItem("token", tokeni.data.token);
        localStorage.setItem("refresh_token", tokeni.data.refresh_token);
        localStorage.setItem("idUloga", tokeni.data.idUloga);
        localStorage.setItem("idKorisnik", tokeni.data.idKorisnik);
        console.log("Uloga: " + localStorage.getItem("idUloga"));
        this.setState({
          alertMessage: "Uspješna prijava",
          alertVisible: true,
          alertColor: "success",
        });
        this.setState({ redirect: true });
      })
      .catch((error) => {
        this.setState({
          alertMessage: error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });

    //axios.get('/provjeripodatke')
    // return correct;
  }
}
export default Login;
