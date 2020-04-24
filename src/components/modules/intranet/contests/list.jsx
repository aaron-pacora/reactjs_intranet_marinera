import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';

import Title from '../../../render/intranet/all/title_def';
import Filter from '../../../render/intranet/all/filter';
import Table from '../../../render/intranet/contests/list/table';

import Pagination from './../../../render/intranet/all/pagination';

import Utils from '../../../../utils/utils';

import '../../../../sass/modules/intranet/contests/index.sass';

class ListContests extends Component{
    constructor(){
        super();
        this.state = {
            dataContests : null,
            pagination: null
        };
        this.utils = new Utils();
        this.name="";
        this.page = location.hash.substring(1);
        if(this.page<=0 || typeof parseInt(this.page)!='number'){
            this.page=1;
            history.pushState(null,"","/concursos#1");
        }
        this.per_page = 10;
        this.filter_info={
            title_filter:"Ingrese nombre",
            button_text: "Nuevo Concurso",
            path: "/concursos/nuevo"
        }
        
    }

    componentDidMount() {
        this.fetchDataContests();
    }

    dataToTable(name){
        name = name.toLowerCase();
        if (name != this.name) {
            this.name = name.trim();
            this.fetchDataContests();
        }
    }
    fetchDataContests(){
        let data = new FormData();
        data.append("name", this.name);
        data.append("page", this.page);
        data.append("per_page", this.per_page);
        this.utils.doQuery("/intranet/contest/index",data)
        .then((rpta) => {
            let notices = JSON.parse(rpta.dataContests);
            let pagination = JSON.parse(rpta.pagination);
            // la data de la "pagination" es genérica, se debe mantener la estructura
            // ya que el componente de la paginación es reutilizable
            this.setState({dataContests: notices,
                            pagination: pagination
                        });
        }).catch((err)=>{
            this.setState({
                dataNotices: null
            
            });
        });
    }

    onAcceptDelete(){
        this.page = 1;
        this.fetchDataContests();
    }
    render(){
        return (
            <div className="index_contests">
                <Header selected="contests"/>
                <div className="content_page">
                    <Title title="Concursos"/>
                    <Filter fnGetContests = {this.dataToTable.bind(this)}
                            data          = { this.filter_info }/>
                    <Table fnRestartByDelete = {this.onAcceptDelete.bind(this)}
                           dataTable         = {this.state.dataContests}
                           currentPage       = {this.page}
                           perPage           = {this.per_page}/>
                    <Pagination fnOnChangePage = {this.selectedPage.bind(this)}
                                pagination     = {this.state.pagination} />
                </div>
            </div>
        );
    }
    selectedPage(page){
        this.page = page;
        this.fetchDataContests();
    }

}

export default ListContests;
