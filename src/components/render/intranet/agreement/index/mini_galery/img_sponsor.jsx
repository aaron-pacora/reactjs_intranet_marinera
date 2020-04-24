import React, { Component } from 'react';
import global from './../../../../../../../providers/global.static.jsx';
import {
    Preloader
} from './../../../../../lib/react-materialize/form_materialize'
import Svg_check from './../../../../../../icons/svg_check.svg'

class MiniGalery extends Component {
    constructor(props){
        super(props);
        this.state={
            id    : this.props.element.id,
            status: this.props.element.status,
            src   : this.props.element.src
        }
        this.resizeSponsor = this.resizeSponsor.bind(this)
    }
    componentDidMount(){
        window.addEventListener("resize",this.resizeSponsor.bind(this))
        this.resizeSponsor();
    }
    resizeSponsor(){
        let newHeight = parseInt(getComputedStyle(this.content_img).width)*0.8;
        this.content_img.style = `height: ${newHeight}`
    }
    render() {
        return (
            <div className="content_img z-depth-3"
                    onClick={this.onClick.bind(this)}
                    ref={(ref)=>{this.content_img = ref}}>
                <img src={global.URBBASERESOURCE+"/agreements/"+this.clearIdUUID(this.state.id)+this.state.src} 
                        alt="img_sponsor" className="img"
                        draggable="false"
                        onLoad={this.onLoad.bind(this)}/>
                <div className="content_preloader">
                    <Preloader size="normal" 
                            color="yellow" />
                </div>
                <div className="content_selected">
                    <Svg_check className="svg_check"/>
                </div>
            </div>
        );
    }
    onLoad(e){
        this.content_img.classList.add("load")
        let width = getComputedStyle(e.target).width;
        let height = getComputedStyle(e.target).height;
        if(height>width){
            e.target.classList.add("vertical")
        }else{
            e.target.classList.remove("vertical")
        }
    }
    clearIdUUID(id){
        id = id.replace(/-/g,"");
        return id;
    }
    onClick(){
        let array = document.querySelectorAll(".content_img")
        let hasSelect =document.querySelectorAll(".content_img.selected")
        if(hasSelect&&this.content_img.classList.contains("hover")){
            this.props.addArrayStatus(this.state.id)
            array.forEach((element)=>{
                element.classList.remove("hover");
                element.classList.remove("selected")
            })
            return 
        }
        if(this.content_img.classList.contains("selected")){
            this.props.clearArrayStatus()
            array.forEach((element)=>{
                element.classList.remove("hover")
            })
            this.content_img.classList.remove("selected")
            
        }else{
            array.forEach((element)=>{
                element.classList.add("hover")
            })
            this.content_img.classList.remove("hover")
            this.content_img.classList.add("selected")
            this.props.addArrayStatus(this.state.id)
        }
        
    }
    
}

export default MiniGalery;