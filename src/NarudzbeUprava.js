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
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
const axios = require("axios");


class NarudzbeUprava extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        address: "1600 Amphitheatre Parkway, Mountain View, california.",
        lat: 37.42216,
        lng: -122.08427,
      },
      products: [
        { id: 1, firma: "Alpha d.o.o.", adresa: "Sarajevska 75 Tuzla", datum: "10.10.2020.", status: "Na čekanju" },
        { id: 2, firma: "Beta d.o.o.", adresa: "Zenička bb Sarajevo", datum: "20.10.2020.", status: "Na čekanju" },
        { id: 3, firma: "Gamma d.o.o.", adresa: "Mostarska 16 Zenica", datum: "01.10.2020.", status: "Na putu" },
        { id: 4, firma: "Delta d.o.o.", adresa: "Tuzlanska 35 Mostar", datum: "11.10.2020.", status: "Isporučena" },
      ],
      alertVisible: false,
      alertMessage: "",
      alertColor: "",
    };
    this.getNarudzbe = this.getNarudzbe.bind(this);
    this.createDostava=this.createDostava.bind(this);
  }

  columns = [
    {
      dataField: "id",
      text: "#",
      sort: true,
    },
    {
      dataField: "firma",
      text: "Naručilac",
      sort: true,
    },
    {
      dataField: "adresa",
      text: "Adresa",
    },
    {
      dataField: "datum",
      text: "Datum narudžbe",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
    },
  ];

  toggle = () => {
    this.setState({ alertVisible: !this.state.alertVisible });
  };
  render() {
    return (
      <Container>
        <Navi name="Pregled dostava"></Navi>
        <br />
        <Alert variant={this.state.alertColor} dismissible show={this.state.alertVisible} onClose={this.toggle}>
          {this.state.alertMessage}
        </Alert>
        <Container>
          <Row>
            <BootstrapTable keyField="id" data={this.state.products} columns={this.columns} bootstrap4={true} />
          </Row>
          <Row>
            <Button variant="primary" onClick={this.createDostava}>Generiši dostave</Button>
          </Row>
        </Container>
      </Container>
    );
  }

  componentDidMount() {
    this.getNarudzbe();
  }
  getNarudzbe() {
    axios
      .get("/narudzba/all")
      .then((res) => {
        var ns = res.data;
        let narudzbe = [];
        ns.forEach((n) => {
          narudzbe.push({ id: n.narudzba.id, firma: n.kupac.Naziv, adresa: n.kupac.Adresa, datum: n.narudzba.VrijemeNarudzbe.substr(0, 10), status: n.narudzba.Status });
        });
        this.setState({ products: narudzbe });
      })
      .catch((error) => {
        this.setState({
          alertMessage: "There was an error while processing request. " + error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });
  }
  createDostava(){
    axios.post("/isporuka/add").then((res)=>{
      this.setState({
        alertMessage: "Uspješno generisane dostave",
        alertVisible: true,
        alertColor: "success",
      });
    })
    .catch((error) => {
      this.setState({
        alertMessage: "Neuspješno generisane dostave: " + error.message,
        alertVisible: true,
        alertColor: "danger",
      });
    });
  }
}

export default NarudzbeUprava;
