import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React,{Component} from 'react'

class Navi extends React.Component  {
    constructor(props) {
        super(props)
        this.state={
            key:localStorage.getItem("naviKey"),
            refresh:0
        }
        this.selektovano=this.selektovano.bind(this);
    }
    componentDidMount() {
        
    }
    
    render(){
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/#/menu">Upravljanje dostavama</Navbar.Brand>
                <Nav variant="pills" onSelect={this.selektovano} activeKey={this.state.key} className="mr-auto" >
                { (localStorage.getItem("idUloga")==='3'|| localStorage.getItem("idUloga")==='1' ) ? <Nav.Item eventKey={1}><Nav.Link href="/#/addorder">Dodavanje narudžbe</Nav.Link></Nav.Item> : null }
                { (localStorage.getItem("idUloga")==='3'|| localStorage.getItem("idUloga")==='1' ) ? <Nav.Item eventKey={2}><Nav.Link href="/#/narudzbeuprava">Pregled svih narudžbi</Nav.Link></Nav.Item> : null }     
                { (localStorage.getItem("idUloga")==='2' ) ? <Nav.Item eventKey={3}><Nav.Link href="/#/dostavavozac">Pregled dostave vozača</Nav.Link></Nav.Item> : null }
                { (localStorage.getItem("idUloga")==='3'|| localStorage.getItem("idUloga")==='1' ) ? <Nav.Item eventKey={4}><Nav.Link href="/#/dostaveuprava">Pregled svih dostava</Nav.Link></Nav.Item> : null }
                { (localStorage.getItem("idUloga")==='1') ? <Nav.Item eventKey={5}><Nav.Link href="/#/registracija">Registracija</Nav.Link></Nav.Item> : null }
                </Nav>
                <Nav className="justify-content-end">
                <Nav.Link href="/" style={{float:"right"}}>Logout</Nav.Link>
                </Nav>
            </Navbar>
        );
    }
    selektovano(x) {
        localStorage.setItem("naviKey",x.toString())
        this.setState({
            
            refresh:this.state.refresh+1
        })
    }
}

export default Navi;