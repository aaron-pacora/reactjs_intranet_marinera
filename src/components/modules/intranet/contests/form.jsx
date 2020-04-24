import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';

import Title from '../../../render/intranet/all/title_def';
import Form from '../../../render/intranet/contests/form/form';
import {Redirect} from 'react-router-dom';

import Utils from '../../../../utils/utils';

import '../../../../sass/modules/intranet/contests/index.sass';

class FormContests extends Component{
    constructor(props){
        super(props);
        this.redirect = false;
        this.utils = new Utils();
        let paramsRoute = this.props.match.params;  // obtener parámetros que llegen por ruta(el id llega por ruta)
        this.state = {
            data : {}
        }
        // Si llega el ID por la ruta, asignara la variable "this.id_contests"
        // caso no llege nada, se le asignará null
        this.id_contest = !!paramsRoute.id ? paramsRoute.id : null ;

        if (this.id_contest != null) {
            if (validator.isUUID(this.id_contest)) { // si es un UUID válido, hacer consulta para traer su data
                let data = new FormData();
                data.append("id", this.id_contest);
                this.utils.doQuery("/intranet/contest/show", data)
                .then((rpta) => {
                    this.setState({ data: rpta });
                });
            } else {
                // al no ser uuid válido, entonces colocar true a la variable para que
                // en el render haga redireccionamiento al listado de noticias
                this.redirect = true;
            }
        }
    }
 
    render(){
        if (this.redirect) return <Redirect to='/concursos' />;
        
        return (
            <div className="form_contests">
                <Header selected="contests"/>
                <div className="content_page">
                    <Title title={!this.id_contest ? 'Nuevo Concurso':'Editar Concurso'} />

                        {
                            (()=>{
                                if (!this.state.data.id) {
                                    return <Form />
                                }else{
                                
                                    return <Form dataContest={this.state.data} />
                                }
                            })()
                        }
                </div>
            </div>
        );
    }
    

}

export default FormContests;
