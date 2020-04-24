import React, { Component } from 'react';

import '../../../../../sass/render/intranet/sponsors/index/buttons_floating.sass';

class ButtonsFloating extends Component {
    constructor(props){
        super(props)
        this.state={
            className : typeof this.props.className=="undefined"?"":this.props.className,
            array_Ids : this.props.array_Ids
            
        }
        this.createSponsor = this.props.createSponsor;
        this.deleteSponsors = this.props.deleteSponsors;
        // this.className= typeof this.props.className=="undefined"?"":this.props.className;
    }
    
    
    componentDidMount(){
        //$(document).ready(()=>{// por si acaso, nunca se sabe con Materialize :'v
            this.add_button.addEventListener("click",()=>{
                this.createSponsor();
            })
            this.delete_button.addEventListener("click",()=>{
                this.deleteSponsors();
                // else{
                //     Materialize.toast('No hay elementos seleccionados', 3000);
                // }
            })
        //});
    }
    componentDidUpdate(prevProps,prevState){
        if(this.state.array_Ids.length>0){
            this.content_buttons.classList.add("show_delete")
        }else{
            this.content_buttons.classList.remove("show_delete")
        }
    }
    // static getDerivedStateFromProps(nextProps,nextState){// introducido en v16.3  :'v, actualizamos?
    //     
    //     if(true){
    //         return {// nuevo metodo de reactjs :'v
    //         className : typeof nextProps.className=="undefined"?"":nextProps.className,
    //         array_Ids : nextProps.array_Ids// no tiene el typeof porque creo
    //                                             // debe ser obligatorio :'v        
    //         }
    //     }
    //     return null;
    // }
    componentWillReceiveProps(nextProps){
        this.setState({
            className : typeof nextProps.className=="undefined"?"":nextProps.className,
            array_Ids : nextProps.array_Ids// no tiene el typeof porque creo
                                                // debe ser obligatorio :'v        
        })
    }
    render() {
        return (
            <div className={`fixed-action-btn ${this.state.className} `}
                    ref={(ref)=>{this.content_buttons=ref}}>
                <a className="new btn-floating btn-large waves-effect waves-light green accent-3"
                        ref={(ref)=>{this.add_button=ref}}>
                    <i className="material-icons">add</i>
                </a>
                <a className="delete btn-floating btn-large waves-effect waves-light red accent-3"
                        ref={(ref)=>{this.delete_button=ref}}>
                    <i className="material-icons">delete</i>
                </a>    
            </div>
        );
    }
    
}

export default ButtonsFloating;