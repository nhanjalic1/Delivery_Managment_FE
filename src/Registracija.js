import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Navi from "./Navi";
import React, { Component } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
const axios = require("axios");

class Registracija extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      greska: false,
      alertVisible: false,
      alertMessage: "",
      alertColor: "",
      poruka: "",
      uloge: [
        { id: 1, naziv: "Uprava" },
        { id: 2, naziv: "Vozač" },
        { id: 3, naziv: "Administrator" },
      ],
      ulogaid: 3,
    };
    this.passwordRef = React.createRef();

    this.submit = this.submit.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.changeUloga = this.changeUloga.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeLastname = this.changeLastname.bind(this);
  }
  username = "";
  password = "";
  ime = "";
  prezime = "";
  render() {
    return (
      <Container>
        <Navi name="Registracija"></Navi>

        <br />
        <Container>
          <Alert variant={this.state.alertColor} dismissible show={this.state.alertVisible} onClose={this.toggle}>
            {this.state.alertMessage}
          </Alert>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Ime korisnika</Form.Label>
              <Form.Control autoFocus={true} onChange={this.changeName} type="text" placeholder="Unesite ime" />
            </Form.Group>
            <Form.Group controlId="formLastname">
              <Form.Label>Prezime korisnika</Form.Label>
              <Form.Control autoFocus={true} onChange={this.changeLastname} type="text" placeholder="Unesite prezime" />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Korisničko ime</Form.Label>
              <Form.Control autoFocus={true} onChange={this.changeUsername} type="text" placeholder="Unesite korisničko ime" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control ref={this.passwordRef} onChange={this.changePassword} type="password" placeholder="Unesite lozinku" />
              {this.state.greska && <Form.Text className="text-muted">{this.state.poruka}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Uloga korisnika</Form.Label>
              <Form.Control as="select" onChange={this.changeUloga}>
                {this.state.uloge.map((u, i) => {
                  return (
                    <option value={u.id} key={u.id}>
                      {u.naziv}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>

            <Button href="#" onClick={this.submit} variant="primary" type="submit">
              Kreiraj korisnika
            </Button>
          </Form>
        </Container>
      </Container>
    );
  }
  componentDidMount() {
    document.addEventListener("keydown", this.keyPress);
  }
  submit() {
    this.passwordRef.current.value = "";
    this.passwordRef.current.focus();
    this.createUser();
    //this.checkCredentials();
    //this.setState({redirect:true})
    //console.log(this.passwordStrength(this.password));
    /*this.setState({greska:true});
        this.passwordRef.current.value='';
        this.passwordRef.current.focus();*/
  }
  changeName(a) {
    this.ime = a.target.value;
  }
  changeLastname(a) {
    this.prezime = a.target.value;
  }
  changeUsername(a) {
    this.username = a.target.value;
  }
  changePassword(a) {
    this.password = a.target.value;
    switch (this.passwordStrength(this.password)) {
      case 0:
        this.setState({
          greska: true,
          poruka: "Slaba lozinka: Potrebna duža od 12 znakova, minimalno dvije vrste znakova",
        });
        break;
      case 1:
        this.setState({
          greska: true,
          poruka: "Srednja lozinka: Potrebna duža od 12 znakova, minimalno dvije vrste znakova",
        });
        break;
      case 2:
        this.setState({
          greska: true,
          poruka: "",
        });
        break;
    }
  }
  changeUloga(a) {
    this.setState({ ulogaid: a.target.value });
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
    if (pass.length < 8) return 0;
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
    if (vrste > 1 && pass.length > 12) return 2;
    return 1;
  }
  createUser() {
    let passwordTemp = this.password;
    this.password = "";
    switch (this.passwordStrength(passwordTemp)) {
      case 0:
        this.setState({
          alertMessage: "Lozinka ne ispunjava uvjete",
          alertVisible: true,
          alertColor: "warning",
        });
        break;
      case 1:
        this.setState({
          alertMessage: "Lozinka ne ispunjava uvjete",
          alertVisible: true,
          alertColor: "warning",
        });
        break;
      case 2:
        axios
          .post("/users/user", {
            username: this.username,
            password: passwordTemp,
            ime: this.ime,
            prezime: this.prezime,
            idUloga: this.state.ulogaid,
          })
          .then(() => {
            this.setState({
              alertMessage: "Uspješno kreiran novi korisnik",
              alertVisible: true,
              alertColor: "success",
            });
          })
          .catch((error) => {
            this.setState({
              alertMessage: "Neuspješno kreiran novi korisnik: " + error.response.data.message,
              alertVisible: true,
              alertColor: "danger",
            });
          });
        break;
    }
  }
}
export default Registracija;
