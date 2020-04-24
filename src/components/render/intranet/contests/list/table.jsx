import React, { Component } from 'react';

import IconEdit from '../../../../../icons/svg_edit.svg';
import IconDelete from '../../../../../icons/svg_delete.svg';

import Utils from '../../../../../utils/utils';

class Table extends Component{
    constructor(props){
        super(props);
        this.utils = new Utils();
        this.onDelete = this.onDelete.bind(this);
        this.state={
            dataTable:this.props.dataTable
        }
        $(document).ready(function () {
            $('.modal').modal();
        });
        this.state = {
            id    : '',
            title : '',
            date  : ''
        };
    }
    parseToString(value){
        //2018-06-11 17:46:13.872289
        let arrayMonth = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
        let timeStamp = value.split(" ")
        let date = timeStamp[0].split("-")
        let day = parseInt(date[2])
        let month = arrayMonth[parseInt(date[1])-1]
        let year = date[0]

        let time_stamp = `${day} ${month}, ${year}`// mi formateo :'v
        return time_stamp;
        // 13 Junio, 2018
    }
    onDelete(id,date,name){
        this.setState({
            id: id,
            name: name,
            date: date
        });
    }
    render(){
        
        return (
            <div className="table_design">
                <div className="headboard">
                
                    <div className="item">
                        <div className="order_number">
                            <span>N°</span>
                        </div>
                        <div className="day_item">
                            <span>Día del Evento</span>
                        </div>
                        <div className="name_item">
                            <span>Nombre</span>
                        </div>
                        <div className="place_item">
                            <span>Lugar</span>
                        </div>
                        <div className="options_item">
                            <span>Opciones</span>
                        </div>
                    </div>
                
                </div>
                <div className="body_table_design">
                {
                    (()=>{
                        if (!!this.props.dataTable){
                            return this.printDataInItem(this.props.dataTable)
                        } else if (this.props.dataTable == null){
                            return (<div className="message_empty">Sin concursos que mostrar</div>);
                        }
                    })()
                    
                }
                    <div id="popupdelete" className="modal">
                        <div className="modal-content modal-trigger">
                            <h4>¿Desea eliminar esta noticia?</h4>
                            <div className="line_modal"></div>
                            <span>{"Se eliminará la noticia: "+this.state.name}</span>
                            <br/>
                            <span>{"Fecha de Publicación: "+this.state.date}</span>
                        </div>
                        <div className="modal-footer">
                            <div className="modal-action modal-close waves-effect waves-green btn" onClick={() => { this.acceptDelete() }}>Sí</div>
                            <div className="modal-action modal-close waves-effect waves-green btn" onClick={() => { this.onCancelDelete() }}>No</div>
                        </div>
                    </div> 
                </div>
            </div>
            
        );
    }

    acceptDelete(){
        let data = new FormData();
        data.append("id", this.state.id);
        this.utils.doQuery("/intranet/contest/delete", data)
        .then((rpta) => {
            if (rpta) {
                this.props.fnRestartByDelete();
            }else{
                Materialize.toast('¡Ha ocurrido un error!', 4000)
            }
        });
    }
    onCancelDelete(){
        this.setState({
            id: "",
            name: "",
            date: ""
        });
    }
    changeFormat(time) {
        time = time.slice(0, 10);
        var elements = time.split("-");
        return elements[2] + "/" + elements[1] + "/" + elements[0];
    }
                      

    printDataInItem(data){
        if (data != null) {
            let currentPage = this.props.currentPage;
            let perPage = this.props.perPage;
            if (data.length != 0) {
                var elements = data.map((el,count) => {
                    return <div className="item" key={el.id}>
                        <div className="order_number">
                            <span>{perPage * (currentPage - 1) + count + 1}</span>
                        </div>
                        <div className="day_item">
                            <span>{ this.parseToString(el.date) }</span>
                        </div>
                        <div className="name_item">
                            <span>{ el.name }</span>
                        </div>
                        <div className="place_item">
                            <span>{ el.place}</span>
                        </div>
                        <div className="options_item">
                            <a href={"concursos/"+el.id} className="icon_option" title="Editar">
                                <IconEdit />
                            </a>
                            <div className="icon_option modal-trigger" title="Eliminar" href="#popupdelete" onClick={()=>{
                                    this.onDelete(el.id,el.date,el.name)
                                }}>
                                <IconDelete />
                            </div>
                        </div>
                    </div>
                });
                return elements;
            }
        }
        return (<div className="message_empty">Sin Concursos que mostrar</div>);
    }
}

export default Table;