import React, { Component } from 'react';
import Table from './../index/table'

import Utils from '../../../../../utils/utils';

class Tab extends Component {
    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
        this.state = {
            Service_Email: this.props.ServiceEmail,
            Detail_Emails: this.props.DetailEmail,
            idContact    : "",
            name         : "",
            type         : ""
        }
        this.utils = new Utils();
    }
    componentDidMount(){
        $(document).ready(function () {
            $('ul.tabs').tabs();
        });
    }
    onDelete(id, nameContact,type) {
        this.setState({
            idContact: id,
            name: nameContact,
            type:type
        });
    };
    acceptDelete() {
        $('#' + this.state.idContact).remove();                
        let data = new FormData();
        data.append("id", this.state.idContact);
        data.append("type", this.state.type);
        this.utils.doQuery("/intranet/contactos/delete", data)
        .then((rpta) => {
            if (rpta) {
                Materialize.toast('Se eliminó el contacto correctamente', 4000)
            } else {
                Materialize.toast('¡Ha ocurrido un error!', 4000)
            }
        });
    };

    onCancelDelete() {
        this.setState({
            idContact: "",
            name: ""
        });
    };
    render(){
        if (this.state.Service_Email != null) {
            return(
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3"><a className="active" href="#table_service">Inscritos</a></li>
                            <li className="tab col s3"><a className="no" href="#table_detail">Responder</a></li>
                        </ul>
                    </div>
                    <Table
                        idname= "table_service"
                        ServiceEmails = {this.state.Service_Email}
                        TableonDelete = {this.onDelete}
                        msj="No hay contactos inscritos"
                    />
                    <Table
                        idname="table_detail"
                        ServiceEmails = {this.state.Detail_Emails}
                        TableonDelete={this.onDelete}
                        msj = "No hay mensajes por responder"
                    />
                    <div id="popupdelete" className="modal">
                        <div className="modal-content modal-trigger">
                            <h4>¿Desea eliminar este contacto?</h4>
                            <div className="line_modal"></div>
                            <span>{"Se eliminará el contacto: " + this.state.name}</span>
                            <br />
                        </div>
                        <div className="modal-footer">
                            <div className="modal-action modal-close waves-effect waves-green btn" onClick={() => { this.acceptDelete() }}>Sí</div>
                            <div className="modal-action modal-close waves-effect waves-green btn" onClick={() => { this.onCancelDelete() }}>No</div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div></div>
            )
        }
    }
}
export default Tab;