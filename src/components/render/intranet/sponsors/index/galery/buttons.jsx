import React, { Component } from 'react';


import Svg_edit from './../../../../../../icons/svg_edit.svg'
import Svg_save from './../../../../../../icons/svg_save.svg'
import Svg_upload from './../../../../../../icons/svg_upload.svg'
import './../../../../../../sass/render/intranet/sponsors/index/buttons.sass'
class Buttons extends Component {
    constructor(props){
        super(props);
        
    }
    
    componentDidMount(){
        
    }
    render() {  
        return (
            <div className="content_buttons" 
                    onClick={this.onClick.bind(this)}>
                <Svg_edit className="edit"/>
                <Svg_save className="save"/>
                <Svg_upload className="upload"/>
                
            </div>
        );
    }  
    onClick(e){
        if(!e.target.classList.contains("upload-img")
            &&!this.props.getArrayIdsLength()){
            if(e.target.classList.contains("edit-img")){//entonces esta para guardar
                this.props.updateSponsor();
                e.target.classList.remove("edit-img");   
                e.target.classList.add("upload-img"); 
                // this.props.changeAction("save");
            }else{
                this.props.changeAction("upload")
                e.target.classList.remove("upload-img"); 
                e.target.classList.add("edit-img")
                // this.props.changeAction("edit")
            }
        }
        if(this.props.getArrayIdsLength()){
            Materialize.toast("No puede editar, cuando hay \nelementos seleccionados",3000)
        }
        
        // e.target.classList.toggle("click");
    }

}

export default Buttons;