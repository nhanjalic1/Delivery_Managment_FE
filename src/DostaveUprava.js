import Container from "react-bootstrap/Container";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Navi from "./Navi";
import BootstrapTable from "react-bootstrap-table-next";
import GoogleMapReact from "google-map-react";
import MapPin from "./MapPin";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Alert } from "react-bootstrap";
const axios = require("axios");

class DostaveUprava extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isporuke: [{ idIsporuke: 2, ime: "Naida Hanjalic", idVozilo: 1, idKorisnik: 2 }],
      alertVisible: false,
      alertMessage: "",
      alertColor: "",
    };
  }

  columns = [
    {
      dataField: "idIsporuke",
      text: "Dostava",
      sort: true,
    },
    {
      dataField: "idVozilo",
      text: "Vozilo",
      sort: true,
    },
    {
      dataField: "ime",
      text: "Vozač",
    },
  ];
  render() {
    return (
      <Container>
        <Alert variant={this.state.alertColor} dismissible show={this.state.alertVisible} onClose={this.toggle}>
          {this.state.alertMessage}
        </Alert>
        <Navi name="Pregled dostava"></Navi>
        <br />
        <Container>
          <BootstrapTable keyField="idIsporuke" data={this.state.isporuke} columns={this.columns} bootstrap4={true} />
        </Container>
      </Container>
    );
  }
  componentDidMount() {
    this.getIsporuke();
  }
  getIsporuke() {
    axios
      .get("/isporuka/all")
      .then((res) => {
        var ns = res.data;
        let isporuke = [];
        ns.forEach((n) => {
          isporuke.push({ idIsporuke: n.isporuka.id, ime: n.korisnik.Ime + " " + n.korisnik.Prezime, idVozilo: n.vozilo.id, idKorisnik: n.korisnik.id });
        });
        this.setState({ isporuke: isporuke });
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

export default DostaveUprava;
