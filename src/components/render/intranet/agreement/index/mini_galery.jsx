import React, { Component } from 'react';
import Img_sponsor from './mini_galery/img_sponsor'

import Utils from '../../../../../utils/utils';

import '../../../../../sass/render/intranet/agreement/index/mini_galery/mini_galery.sass';

class MiniGalery extends Component {
    constructor(props){
        super(props);
        this.state={
            data        : [],
            array_status: []
        }
        this.utils = new Utils();
    }
    componentDidMount(){
        this.fetchSponsor()
    }
    componentDidUpdate(){
        if(this.state.array_status.length==2){
            this.clearArrayStatus()
            this.changeStatus();
        }
    }
    fetchSponsor(){
        this.utils.doQuery("/intranet/agreement/index")
        .then((response)=>{
            this.setState({
                data: response
            })
        })
    }
    render() {
        return (
            <div className="content_mini_galery">
                {
                    this.state.data?
                    this.state.data
                        .filter(element=>element.src!="empty")
                        .map((element)=>{
                            return <Img_sponsor key = {element.id}
                                   element          = {element}
                                   addArrayStatus   = {this.addArrayStatus.bind(this)}
                                   clearArrayStatus = {this.clearArrayStatus.bind(this)}/>
                        }):
                        ""
                }
            </div>
        );
    }
    addArrayStatus(status){
        this.setState((prevState,props)=>({
            array_status : prevState.array_status.concat(status)
        }))
        
    }
    clearArrayStatus(){
        this.setState({
            array_status : []
        })
    }
    changeStatus(){
        
        let form = new FormData();
        form.append("id_f",this.state.array_status[0]);
        form.append("id_s",this.state.array_status[1]);
        this.utils.doQuery("/intranet/agreement/changeStatus", form)
        .then((response)=>{
            if(response){
                setTimeout(() => {
                    Materialize.toast("Se cambio el orden con éxito",1500)
                }, 500);
            }else{
                setTimeout(() => {
                    Materialize.toast("Hubo problemas con el cambio de orden",3000)
                }, 500);
            } 
            this.fetchSponsor()
        });

    }
}

export default MiniGalery;