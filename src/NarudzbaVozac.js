import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Navi from "./Navi";
import GoogleMapReact from "google-map-react";
import MapPin from "./MapPin";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Alert } from "react-bootstrap";
const axios = require("axios");

class NarudzbaVozac extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        address: "Sarajevo",
        lat: 43.858305,
        lng: 18.411367,
      },
      artikli: [],
      narucioc: "",
      vrijemeIsporuke: "",
      idNarudzba: props.location.state.idNarudzba,
      alertVisible: false,
      alertMessage: "",
      alertColor: "",
      neuspjesna: false,
    };
    this.getArtikli = this.getArtikli.bind(this);
    this.ChangeStatus = this.ChangeStatus.bind(this);
    this.ChangeStatus2 = this.ChangeStatus2.bind(this);
    this.Neuspjesna = this.Neuspjesna.bind(this);
    this.Razlog = this.Razlog.bind(this);
  }
  razlogText = "";
  columns = [
    {
      dataField: "rb",
      text: "#",
      sort: true,
    },
    {
      dataField: "naziv",
      text: "Naziv artikla",
      sort: true,
    },
    {
      dataField: "kolicina",
      text: "Količina",
      sort: true,
    },
  ];
  selectRow = {
    mode: "radio",
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: "#00BFFF",
  };

  toggle = () => {
    this.setState({ alertVisible: !this.state.alertVisible });
  };
  render() {
    return (
      <Container>
        <Navi name="Pregled dostave"></Navi>
        <br />
        <Alert variant={this.state.alertColor} dismissible show={this.state.alertVisible} onClose={this.toggle}>
          {this.state.alertMessage}
        </Alert>
        <Container>
          <Row>
            <Form.Label>Naručilac</Form.Label>
          </Row>
          <Row>
            <h5>{this.state.narucioc}</h5>
          </Row>
          <Row>
            <Col>
              <BootstrapTable keyField="rb" data={this.state.artikli} columns={this.columns} bootstrap4={true} selectRow={this.selectRow} />
            </Col>
            <Col>
              <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Row>
                    <Form.Label>Procijenjeno vrijeme dolaska</Form.Label>
                  </Form.Row>
                  <Form.Row>
                    <h5>{this.state.vrijemeIsporuke.substr(0, 10)}</h5>
                  </Form.Row>
                  <br />
                  <Form.Row>
                    <Col>
                      <Button variant="primary" type="button" onClick={this.ChangeStatus}>
                        Isporučena narudžba
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="primary" type="button" onClick={this.Neuspjesna}>
                        Neuspješna narudžba
                      </Button>
                    </Col>
                  </Form.Row>
                  <br />
                  {this.state.neuspjesna && (
                    <Form.Row>
                      <Form.Label>Razlog neuspješne narudžbe</Form.Label>
                      <Form.Control as="textarea" rows={3} onChange={this.Razlog} />
                      <Button variant="primary" type="button" onClick={this.ChangeStatus2}>
                        Potvrdi
                      </Button>
                    </Form.Row>
                  )}
                  <br />
                  <Form.Row>
                    <Form.Label>Adresa</Form.Label>

                    <div style={{ height: "300px", width: "100%" }}>
                      <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyBgnez0Qm0mhtlw4jnXJhZxdFSH4P18akQ" }} center={this.state.location} defaultZoom={13}>
                        <MapPin lat={this.state.location.lat} lng={this.state.location.lng} text={this.state.location.address} />
                      </GoogleMapReact>
                    </div>
                  </Form.Row>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
  componentDidMount() {
    this.getArtikli();
  }
  ChangeStatus() {
    axios
      .put("/narudzba/changeStatus", {
        id: this.state.idNarudzba,
        status: "Isporučeno",
        razlog: null,
      })
      .then(() => {
        this.setState({
          alertMessage: "Uspješno promijenjen status narudžbe",
          alertVisible: true,
          alertColor: "success",
          neuspjesna: false,
        });
      })
      .catch((error) => {
        this.setState({
          alertMessage: "Neuspješno promijenjen status narudžbe" + error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });
  }
  ChangeStatus2() {
    axios
      .put(
        "/narudzba/changeStatus",
        {
          id: this.state.idNarudzba,
          status: "Neuspješno",
          razlog: this.razlogText,
        },
        {}
      )
      .then(() => {
        this.razlogText = "";
        this.setState({
          alertMessage: "Uspješno promijenjen status narudžbe",
          alertVisible: true,
          alertColor: "success",
          neuspjesna: false,
        });
      })
      .catch((error) => {
        this.setState({
          alertMessage: "Neuspješno promijenjen status narudžbe" + error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });
  }
  getArtikli() {
    axios
      .get("/narudzba/id/" + this.state.idNarudzba, {
        /* headers: {
                 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
             }*/
      })
      .then((res) => {
        var data = res.data;
        let artikli = [];
        var i = 1;
        data.artikli.forEach((n) => {
          artikli.push({ rb: i, naziv: n.naziv, kolicina: n.kolicina });
          i++;
        });
        this.setState({ artikli: artikli });
        this.setState({ location: { address: data.kupac.Adresa, lat: data.kupac.lokacijLat, lng: data.kupac.lokacijLng } });
        this.setState({ narucioc: data.kupac.Naziv });
        this.setState({ vrijemeIsporuke: data.narudzba.RokIsporuke });
      })
      .catch((error) => {
        this.setState({
          alertMessage: "There was an error while processing request. " + error.response.data.message,
          alertVisible: true,
          alertColor: "danger",
        });
      });
  }
  Neuspjesna() {
    this.setState({ neuspjesna: true });
  }
  Razlog(a) {
    this.razlogText = a.target.value;
  }
}

export default NarudzbaVozac;
