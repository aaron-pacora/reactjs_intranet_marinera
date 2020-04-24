import React, { Component } from 'react';

import '../../../../../sass/render/intranet/agreement/index/check_mode.sass';

class CheckMode extends Component {
    constructor(props){
        super(props);
        this.state={
            isChecked : false
        }
    }
    render() {
        return (
            <div className="content_check_mode">
                <input type="checkbox" 
                        className="filled-in" 
                        id="filled-in-box"
                        ref={(ref)=>this.input=ref}  
                        checked={this.state.isChecked}/>
                <label for="filled-in-box"
                        onClick={this.onClick.bind(this)}>Modo - Cambiar orden</label>    
            </div>
        );
    }
    onClick(){
        let selectedItems = document.querySelector(".sponsor.selected");
        let updatingItems = document.querySelector(".sponsor.editable_sponsor")
        if(!selectedItems&&!updatingItems){
            this.setState((prevState,props)=>({
                isChecked : !prevState.isChecked
            }))
            this.props.setChangeMode()
        }else{
            setTimeout(() => {
                Materialize.toast("No puede cambiar de modo, cuando tiene elementos seleccionados",3000)
            }, 500);
        }
    }
    
}

export default CheckMode;