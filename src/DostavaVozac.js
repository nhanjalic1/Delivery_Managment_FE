import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Navi from './Navi'
import BootstrapTable from 'react-bootstrap-table-next';
import {Redirect} from 'react-router-dom';
import GoogleMapReact from 'google-map-react'
import MapPin from './MapPin'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Alert } from 'react-bootstrap'

const axios = require('axios');
class DostavaVozac extends React.Component {
    constructor(props){
        super(props);
        this.state={  
            idvozac:localStorage.getItem("idKorisnik"),
            location:{
                address: '1600 Amphitheatre Parkway, Mountain View, california.',
                lat: 37.42216,
                lng: -122.08427,
            },
            products : [
                {id: 1,firma:"Alpha d.o.o.", adresa:"Sarajevska 75 Tuzla", datum:"10.10.2020.",status:"Na čekanju", rokIsporuke:"10.11.2020.",lokacijaLat:37.42216, lokacijaLng:-122.08427},
                {id: 2,firma:"Beta d.o.o.", adresa:"Zenička bb Sarajevo", datum:"20.10.2020.",status:"Na čekanju", rokIsporuke:"10.11.2020.",lokacijaLat:57.42216, lokacijaLng:-172.08427},
                {id: 3,firma:"Gamma d.o.o.", adresa:"Mostarska 16 Zenica", datum:"01.10.2020.",status:"Na putu", rokIsporuke:"10.11.2020.",lokacijaLat:37.42216, lokacijaLng:-122.08427},
                {id: 4,firma:"Delta d.o.o.", adresa:"Tuzlanska 35 Mostar", datum:"11.10.2020.",status:"Isporučena", rokIsporuke:"10.11.2020.",lokacijaLat:67.42216, lokacijaLng:-142.08427}
            ],
            rokIsporuke:"10.10.2020.",
            alertVisible: false,
            alertMessage: "",
            alertColor: "",
            redirect:false,
            idnarudzba:0
        }
    }
    
    columns = [
        {
            dataField: 'id',
            text: '#',
            sort:true
        },{
            dataField: 'firma',
            text: 'Naručilac',
            sort:true
        }, {
            dataField: 'adresa',
            text: 'Adresa'
        }, {
            dataField: 'datum',
            text: 'Datum narudžbe',
            sort:true
        }, {
            dataField:'status',
            text:'Status'
        }];
    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        bgColor: '#00BFFF',
    };
    toggle = () => {
        this.setState({ alertVisible: !this.state.alertVisible });
      };
    render(){
        if(this.state.redirect){
            return(<Redirect
                to={{
                pathname: "/narudzbavozac",
                state: { idNarudzba: this.state.idnarudzba }
            }}
            />)
        }
    return (
        <Container>
            <Alert
                    variant={this.state.alertColor}
                    dismissible
                    show={this.state.alertVisible}
                    onClose={this.toggle}>
                    {this.state.alertMessage}
            </Alert>
            <Navi name="Pregled dostava"></Navi>
            <br/>
            <Container>
            <Row></Row>
            <Row>
            <Col>
                <BootstrapTable   
                    keyField='id' 
                    data={ this.state.products } 
                    columns={ this.columns } 
                    bootstrap4={true} 
                    selectRow={ this.selectRow }
                    rowEvents={ {onClick: (e, row, rowIndex) => 
                        {
                            this.setState({redirect:true,idnarudzba:row.id});
                        } 
                    }} />
                </Col>
                </Row>
            </Container>
        </Container>
    );
    }
    componentDidMount(){
        this.getIsporuka();
    }
    getIsporuka() {
        axios.get("/isporuka/id/"+this.state.idvozac, {
            /* headers: {
                 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
             }*/
         }).then((res) => {
            var ns =res.data;
            let narudzbe= [];
            ns.forEach(n=>{
                narudzbe.push({id:n.narudzba.id,firma:n.kupac.Naziv, adresa:n.kupac.Adresa, datum:n.narudzba.VrijemeNarudzbe.substr(0,10),status:n.narudzba.Status,rokisporuke:n.narudzba.RokIsporuke.substr(0,10),lokacijaLat:n.kupac.lokacijLat, lokacijaLng:n.kupac.lokacijLng})
            })
            var lokacija={adress:"Mountain View, California",lat: 37.42216,lng: -122.08427};
            var procjena="";
            if(narudzbe.length>0){
                lokacija.adress=narudzbe[0].adresa;
                lokacija.lat=narudzbe[0].lokacijaLat;
                lokacija.lng=narudzbe[0].lokacijaLng;
                procjena=narudzbe[0].datum;
            } 
             this.setState({ 
                 products: narudzbe,
                 location:lokacija,
                 rokIsporuke:procjena
                 });
             
          }).catch((error) => {
             this.setState({
                 alertMessage: "There was an error while processing request. "  + error.response.data.message,
                 alertVisible: true,
                 alertColor: "danger",
             });
         });
    }
}

export default DostavaVozac;
