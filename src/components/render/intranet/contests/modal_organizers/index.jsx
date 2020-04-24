import React, { Component } from 'react';


import Title from '../../../../render/intranet/all/title_def';

import Galery from './galery.jsx';
import Utils from '../../../../../utils/utils';

import ButtonsFloating from './buttons_floating';

import '../../../../../sass/render/intranet/contests/modal_organizers/index.sass';

class OrganizerIndex extends Component {
    constructor(){
        super();
        this.state = {
            update_galery: 0,
            array_Ids    : [],   ///of sponsor with class selected,
        }
        this.utils = new Utils();
        this.addIdToArray = this.addIdToArray.bind(this)
        this.removeIdToArray = this.removeIdToArray.bind(this)
    }
    render() {
        return (
            <div className="organizer_index">
                {/* <Header selected="sponsors"/> */}
                
                <Title title="Organizadores"/>
                <Galery update_galery={this.state.update_galery}
                            addIdToArray={this.addIdToArray}
                            removeIdToArray={this.removeIdToArray}
                            getArrayIdsLength={this.getArrayIdsLength.bind(this)}
                            fetchOrganizers={this.props.fetchOrganizers}/>  
                <ButtonsFloating className=""
                                    array_Ids={this.state.array_Ids} 
                                    createOrganizer={this.createOrganizer.bind(this)}
                                    deleteOrganizers= {this.deleteOrganizers.bind(this)}/>
                
                
            </div>
        );
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
    createOrganizer(){
        this.utils.doQuery("/intranet/organizer/create")
        .then((response)=>{//json
            this.changeUpdateState();
            this.props.fetchOrganizers();
        })

    }
    deleteOrganizers(){
        let form= new FormData();
        form.append("ids",this.state.array_Ids)
        let delete_button = document.querySelector(".delete.btn-floating")
        delete_button.setAttribute("disabled",true)
        this.utils.doQuery("/intranet/organizer/delete", form)
        .then((response)=>{
            if(response&&response!="has contests"){
                this.setState({
                    array_Ids : []
                });

                // this.array_Ids=[]
                this.changeUpdateState();
                this.props.fetchOrganizers();
                setTimeout(() => {
                    Materialize.toast("Se eliminó los elementos con éxito",3000)
                }, 500); 
            }else if(response=="has contests"){
                Materialize.toast("Error, elimine los concursos relacionados primero",3000)
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

export default OrganizerIndex;