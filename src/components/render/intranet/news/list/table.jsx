import React, { Component } from 'react';

import Utils from '../../../../../utils/utils';
import IconEdit from '../../../../../icons/svg_edit.svg';
import IconDelete from '../../../../../icons/svg_delete.svg';

class Table extends Component {
    constructor(props){
        super(props);
        this.onDelete = this.onDelete.bind(this);
        this.utils = new Utils();
        $(document).ready(function () {
            $('.modal').modal();
        });
        this.state = {
            id    : '',
            title : '',
            date  : ''
        };
    }

    onDelete(id,date,title){
        this.setState({
            id: id,
            title: title,
            date: date
        });
    }

    acceptDelete(){
        let data = new FormData();
        data.append("id", this.state.id);
        this.utils.doQuery("/intranet/noticias/eliminar_noticia", data)
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
            title: "",
            date: ""
        });
    }

    render() {
        return (
            <div className="table_design">
                <div className="headboard">
                    <div className="item">
                        <div className="order_number">
                            <span>N°</span>
                        </div>
                        <div className="publication_item">
                            <span>Publicado</span>
                        </div>
                        <div className="title_item">
                            <span>Título</span>
                        </div>
                        <div className="subtitle_item">
                            <span>Subtítulo</span>
                        </div>
                        <div className="options_item">
                            <span>Opciones</span>
                        </div>
                    </div>
                </div>
                <div className="body_table_design" ref="list_items">
                    {(()=>{
                        if (!!this.props.dataTable){
                            return this.printDataInItem(this.props.dataTable)
                        } else if (this.props.dataTable == null){
                            return (<div className="message_empty">Sin noticias</div>);
                        }
                    })()}
                    <div id="popupdelete" className="modal">
                        <div className="modal-content modal-trigger">
                            <h4>¿Desea eliminar esta noticia?</h4>
                            <div className="line_modal"></div>
                            <span>{"Se eliminará la noticia: "+this.state.title}</span>
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
                        <div className="publication_item">
                            <span>{this.changeFormat(el.created_at)}</span>
                        </div>
                        <div className="title_item">
                            <span>{el.title}</span>
                        </div>
                        <div className="subtitle_item">
                            <span>{el.subtitle}</span>
                        </div>
                        <div className="options_item">
                            <a href={"noticias/" + el.id} className="icon_option" title="Editar">
                                <IconEdit />
                            </a>
                            <div className="icon_option modal-trigger" title="Eliminar" href="#popupdelete" onClick={()=>{
                                    this.onDelete(el.id,this.changeFormat(el.created_at),el.title)
                                }}>
                                <IconDelete />
                            </div>
                        </div>
                    </div>;
                });
                return elements;
            }
        }
        return (<div className="message_empty">Sin noticias</div>);
    }

    changeFormat(time) {
        time = time.slice(0, 10);
        var elements = time.split("-");
        return elements[2] + "/" + elements[1] + "/" + elements[0];
    }
}

export default Table;
