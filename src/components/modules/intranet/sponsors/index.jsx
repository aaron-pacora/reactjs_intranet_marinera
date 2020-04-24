import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';
import Title from '../../../render/intranet/all/title_def';

import Galery from './../../../render/intranet/sponsors/index/galery';

import Utils from '../../../../utils/utils';

import ButtonsFloating from '../../../render/intranet/sponsors/index/buttons_floating';
import Check_mode from '../../../render/intranet/sponsors/index/check_mode'
import MiniGalery from '../../../render/intranet/sponsors/index/mini_galery';

import '../../../../sass/modules/intranet/sponsors/index.sass';

class SponsorsIndex extends Component {
    constructor(){
        super();
        this.state = {
            update_galery : 0,
            array_Ids     : [],    ///of sponsor with class selected,
            is_mode_change: false
        }
        this.utils = new Utils();
        this.addIdToArray = this.addIdToArray.bind(this)
        this.removeIdToArray = this.removeIdToArray.bind(this)
    }

    render() {
        return (
            <div className="sponsors_index">
                <Header selected="sponsors"/>
                <div className="content_page">
                    <Title title="Auspiciadores"/>
                    <Check_mode setChangeMode={this.setChangeMode.bind(this)}/>
                    {
                        this.state.is_mode_change?
                        <MiniGalery/>
                        :
                        <div>
                            <Galery update_galery     = {this.state.update_galery}
                                    addIdToArray      = {this.addIdToArray}
                                    removeIdToArray   = {this.removeIdToArray}
                                    getArrayIdsLength = {this.getArrayIdsLength.bind(this)}/>
                            <ButtonsFloating className      = "content_buttons"
                                             array_Ids      = {this.state.array_Ids}
                                             createSponsor  = {this.createSponsor.bind(this)}
                                             deleteSponsors = {this.deleteSponsors.bind(this)}/>
                        </div>
                    }
                </div>
                
            </div>
        );
    }
    setChangeMode(){
        this.setState((prevState,props)=>(
            {
                is_mode_change : !prevState.is_mode_change
            }
        ))
        
    }
    addIdToArray(id){
        // this.setState({
        //     array_Ids : this.state.array_Ids.concat(id)
        // })
        this.setState((prevState,props)=>({
            array_Ids : prevState.array_Ids.concat(id)
        }));
        
        // this.array_Ids.push(id);
    }
    removeIdToArray(id){
        let index = this.state.array_Ids.indexOf(id);
        this.setState((prevState,props)=>{
            prevState.array_Ids.splice(index,1);// elimina el index coincidente return el mismo index, similar a pop()
            return  {
                array_Ids : prevState.array_Ids
            }
        });
        // this.array_Ids.splice(index,1);
    }
    getArrayIdsLength(){
        return this.state.array_Ids.length
    }

    createSponsor(){
        this.utils.doQuery("/intranet/sponsor/create")
        .then((response)=>{//json
            this.changeUpdateState();
        })
    }

    deleteSponsors(){
        let form = new FormData();
        form.append("ids",this.state.array_Ids)
        let delete_button = document.querySelector(".delete.btn-floating")
        delete_button.setAttribute("disabled",true)
        this.utils.doQuery("/intranet/sponsor/delete",form)
        .then((response)=>{
            if(response){
                this.setState({
                    array_Ids : []
                });

                // this.array_Ids=[]
                this.changeUpdateState();

                setTimeout(() => {
                    Materialize.toast("Se eliminó los elementos con éxito",3000)
                }, 500); 
            }else{
                Materialize.toast("Hubo problemas al eliminar los elementos",3000)
            }
            delete_button.removeAttribute("disabled")
            
        })
    }
    changeUpdateState(){
        this.setState({// pa que mande señal al willRecivieProps
            update_galery: 1
        });
        this.setState({// pa que mande señal al willRecivieProps
            update_galery: 0
        });
    }
}

export default SponsorsIndex;