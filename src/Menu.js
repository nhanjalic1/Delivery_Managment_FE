import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Navi from './Navi'
import React,{Component} from 'react'
import { Redirect, useHistory } from 'react-router-dom';


class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state={
            redirect:false,
            greska:false
        }
    }
    render(){
        return (
            <Navi/>
    )}
}
export default Menu;