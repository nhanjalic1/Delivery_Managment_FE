import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Navi from "./Navi";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Badge, FormGroup, Jumbotron, Alert } from "react-bootstrap";
import styles from "./index.css";
import React, { Component } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const axios = require("axios");

class AddOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      narudzbe: [
        /*{
                naziv:"Mašina za suđe Beko",
                kolicina:3},
            {
                naziv:"Ormar Alpha",
                kolicina:2},
            {
                naziv:"Trpezarijski stol Beta",
                kolicina:1},
            {
                naziv:"Trpezarijska stolica Gamma",
            kolicina:4}*/
      ],
      narucioci: [
        { id: 1, Naziv: "Alpha d.o.o." },
        { id: 2, Naziv: "Beta d.o.o." },
        { id: 3, Naziv: "Gamma d.o.o." },
      ],
      artikli: [
        { id: 1, Naziv: "Stolica Gamma" },
        { id: 2, Naziv: "Stolica Delta" },
        { id: 3, Naziv: "Stolica Epsilon" },
      ],

      Naziv: "",
      id_artikla: 0,
      Kolicina: 1,
      id_kupac: 1,
      startDate: new Date(),
      alertVisible: false,
      alertMessage: "",
      alertColor: "",
    };

    this.dodajArtikal = this.dodajArtikal.bind(this);
    this.changeArtikal = this.changeArtikal.bind(this);
    this.changeKolicina = this.changeKolicina.bind(this);
    this.removeArtikal = this.removeArtikal.bind(this);
    this.getArtikli = this.getArtikli.bind(this);
    this.changeNarucioc = this.changeNarucioc.bind(this);
    this.dodajNarudzbu = this.dodajNarudzbu.bind(this);
  }
  naziv = "Stolica Gamma";
  kolicina = 1;
  componentDidMount() {
    this.getArtikli();
    this.getKupci();
  }
  toggle = () => {
    this.setState({ alertVisible: !this.state.alertVisible });
  };
  render() {
    return (
      <Container>
        <Navi name="Dodavanje narudžbe"></Navi>
        <Alert variant={this.state.alertColor} dismissible show={this.state.alertVisible} onClose={this.toggle}>
          {this.state.alertMessage}
        </Alert>
        <br />
        <Container>
          <Row></Row>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Naziv artikla</th>
                    <th>Količina</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.narudzbe.map((n, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{n.Naziv}</td>
                        <td>{n.kolicina}</td>
                        <td>
                          <Button onClick={() => this.removeArtikal(i)} variant="danger">
                            X
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Form.Row>
                    <Form.Label>Naručilac</Form.Label>
                  </Form.Row>
                  <Form.Row>
                    <Form.Control as="select" onChange={this.changeNarucioc}>
                      {this.state.narucioci.map((n, i) => {
                        return (
                          <option value={n.id} key={n.id}>
                            {n.Naziv}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Row>
                  <Form.Row>
                    <Form.Label>Rok isporuke</Form.Label>
                  </Form.Row>
                  <Form.Row>
                    <DatePicker className={"form-control"} style={{ width: "100%" }} selected={this.state.startDate} onChange={(date) => this.setState({ startDate: date })} />
                  </Form.Row>
                </FormGroup>
                <br />
                <FormGroup>
                  <Form.Label>Artikal</Form.Label>
                  <Form.Control as="select" onChange={this.changeArtikal}>
                    {this.state.artikli.map((a, i) => {
                      return (
                        <option value={a.id} key={a.id} name={a.Naziv}>
                          {a.Naziv}
                        </option>
                      );
                    })}
                  </Form.Control>
                  <Form.Label>Količina</Form.Label>
                  <Form.Row>
                    <Col xs={10}>
                      <Form.Control type="number" min="1" onChange={this.changeKolicina} placeholder="1" />
                    </Col>
                    <Col xs={2}>
                      <Button href="#" variant="secondary" disabled>
                        kom
                      </Button>
                    </Col>
                  </Form.Row>
                  <br />
                  <Button href="#" variant="primary" type="submit" onClick={this.dodajArtikal}>
                    Unesi artikal
                  </Button>
                </FormGroup>
                <br />
                <br />
                <Button className="float-right" variant="primary" type="button" onClick={this.dodajNarudzbu}>
                  Finaliziraj narudžbu
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
  dodajNarudzbu() {
    axios
      .post("/narudzba/kreirajNarudzbu", {
        rokIsporuke: this.state.startDate,
        idKupac: this.state.id_kupac,
        narudzbaItems: this.state.narudzbe,
        /*let rokIsporuke=req.body.rokIsporuke;
            let idKupac=req.body.idKupac;
            let narudzbaItems=req.body.narudzbaItems;*/
      })
      .then(() => {
        this.setState({
          alertMessage: "Uspješno dodana nova narudžba",
          alertVisible: true,
          alertColor: "success",
        });
      })
      .catch((error) => {
        this.setState({
          alertMessage: "Neuspješno dodana nova narudžba" + error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });
  }
  changeNarucioc(a) {
    this.setState({ id_kupac: Number(a.target.value) });
  }
  dodajArtikal() {
    this.setState((state) => ({
      narudzbe: state.narudzbe.concat([{ Naziv: this.state.Naziv, kolicina: this.state.Kolicina, id: this.state.id_artikla }]),
    }));
  }
  changeArtikal(a) {
    var name = "";
    this.state.artikli.forEach((i) => {
      if (i.id == a.target.value) name = i.Naziv;
    });
    this.setState({ Naziv: name, id_artikla: Number(a.target.value) });
  }
  changeKolicina(a) {
    this.setState({ Kolicina: a.target.value });
  }
  removeArtikal(i) {
    let ntemp = this.state.narudzbe;
    ntemp.splice(i, 1);
    this.setState({
      narudzbe: ntemp,
    });
  }
  getArtikli() {
    axios
      .get("/roba/all")
      .then((res) => {
        var artikli = res.data;
        this.setState({ artikli: artikli, Naziv: res.data[0].Naziv, id_artikla: res.data[0].id });
      })
      .catch((error) => {
        this.setState({
          alertMessage: "There was an error while processing request. " + error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });
  }
  getKupci() {
    axios
      .get("/kupac/all")
      .then((res) => {
        var narucioci = res.data;
        this.setState({ narucioci: narucioci });
      })
      .catch((error) => {
        this.setState({
          alertMessage: "There was an error while processing request. " + error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });
  }
}
export default AddOrder;
