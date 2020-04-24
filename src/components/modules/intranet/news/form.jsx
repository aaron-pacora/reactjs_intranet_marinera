import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import Header from '../../../layouts/intranet/header';
import Title from '../../../render/intranet/all/title_def';
import Form from '../../../render/intranet/news/form/form';

import Utils from '../../../../utils/utils';

import '../../../../sass/modules/intranet/news/form.sass';

class formNotice extends Component {
    constructor(props) {
        super(props);
        this.redirect = false;
        let paramsRoute = this.props.match.params;  // obtener parámetros que llegen por ruta(el id llega por ruta)
        this.state = {
            data : {}
        }
        // Si llega el ID por la ruta, asignara la variable "this.id_notice"
        // caso no llege nada, se le asignará null
        this.id_notice = !!paramsRoute.id ? paramsRoute.id : null ;
        this.utils = new Utils();
        // Si el "this.id_notice" será null cuando no llege el ID por ruta, por ende es porque será el formulario "Nueva Noticia"
        if (this.id_notice != null) {
            if (validator.isUUID(this.id_notice)) { // si es un UUID válido, hacer consulta para traer su data
                let data = new FormData();
                data.append("id", this.id_notice);
                this.utils.doQuery("/intranet/noticias/obtener_noticia",data)
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

    render() {
        if (this.redirect) {
            return <Redirect to='/noticias' />;
        }else{
            return (
                <div className="form_news">
                    <Header selected="news" />
                    <div className="content_page">
                        <Title title={!this.id_notice ? 'Nueva Noticia':'Editar Noticia'} />
                        {(()=>{
                            if (!this.state.data.id) {
                                return <Form />
                            }else{
                                return <Form dataNotice={this.state.data} />
                            }
                        })()}
                    </div>
                </div>
            );
        }
    }
}

export default formNotice;
