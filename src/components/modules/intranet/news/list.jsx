import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';
import Title from '../../../render/intranet/all/title_def';
import Filter from '../../../render/intranet/all/filter';
import Table from '../../../render/intranet/news/list/table';
import Pagination from '../../../render/intranet/all/pagination';

import Utils from '../../../../utils/utils';

import '../../../../sass/modules/intranet/news/list.sass';

class listNotice extends Component {
    constructor(){
        super();
        this.state = {
            dataNotices : null
        };
        this.title = "";
        
        this.page = 1;
        this.per_page = 10;

        this.filter_info={
            title_filter: "Ingrese título",
            button_text : "Nueva Noticia",
            path        : "/noticias/nuevo"
        }
        this.utils = new Utils();
    }

    // Este función es reservada por react js; se ejecuta cada vez que
    // se inicia el componente (leer documentación Component.Reactjs)
    componentDidMount() {
        this.fetchDataNotices();
    }

    // Función que irá como valor del parámetro "fnGetNotices" del componente
    // filter para que eal momento de ingresarse un texto lo ejecute
    dataToTable(title){
        title = title.toLowerCase();
        if (title != this.title) {
            this.title = title;
            this.fetchDataNotices();
        }
    }

    // Función creada para la petición de la data
    fetchDataNotices(){
        let data = new FormData();
        data.append("title_filter", this.title);
        data.append("page", this.page);
        data.append("per_page", this.per_page);
        this.utils.doQuery("/intranet/noticias",data)
        .then((rpta) => {
            let notices = JSON.parse(rpta.dataNotices);
            let pagination = JSON.parse(rpta.pagination);
            // la data de la "pagination" es genérica, se debe mantener la estructura
            // ya que el componente de la paginación es reutilizable
            this.setState({dataNotices: notices,
                            pagination: pagination
                        });
            if(rpta === null){
                this.setState({
                    dataNotices: null
                });
            }
        }).catch((err)=>{
            this.setState({
                dataNotices: null
            });
        });
    }

    // Función qe se manda como valor del parámetro "fnOnChangePage" al 
    // componente de la paginación para que por cada acción la paginación lo ejecuta
    selectedPage(page){
        this.page = page;
        this.fetchDataNotices();
    }

    onAcceptDelete(){
        this.page = 1;
        this.fetchDataNotices();
    }

    // Recordad hacer ".bind(this)" a las funciones que van a otros componentes,
    // para que la función interna, ejecute el "this" del componente principal( list )
    // y no el "this" del componente en donde se ejecutará (Filter, Pagination)
    render() {
        return (
            <div className="list_news">
                <Header selected="news"/>
                <div className="content_page">
                    <Title title="Listado de Noticias"/>
                    <Filter fnGetNotices={this.dataToTable.bind(this)} 
                            data={ this.filter_info}/>
                    <Table fnRestartByDelete={this.onAcceptDelete.bind(this)}
                            dataTable={this.state.dataNotices}
                            currentPage={this.page}
                            perPage={this.per_page}/>
                    <Pagination fnOnChangePage={this.selectedPage.bind(this)} pagination={this.state.pagination} />
                </div>
            </div>
        );
    }
}

export default listNotice;