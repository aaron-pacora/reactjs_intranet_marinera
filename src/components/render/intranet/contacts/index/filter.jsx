import React, { Component } from 'react';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.onsendData = this.onsendData.bind(this);
        this.id = this.props.idname
        this.name = null
    }
    onsendData(e) {
        var check = $('#check_box_all');
        var arrayCheck = [];
        var toSend = {};
        var statusAllContact = false;
        var father = null;
        $("input[name='status']:checked").each(function () {
            father = $(this).parent().parent().children().last();
            arrayCheck.push(father.text());
        });
        if (arrayCheck.length == 0) {
            Materialize.toast('Dele Check en algún contacto', 4000);
            return;
        }
        if (check.is(':checked')) {
            statusAllContact = true;
        }
        toSend.checks = arrayCheck;
        toSend.all_contacts = false;
        toSend.st_all = statusAllContact;
        toSend.description = "";                
        var json = JSON.stringify(toSend);
        var encript = btoa(json);
        window.location.href = "/contactos/" + encript;
    };
    render(){
        return(
            <div className="filter">
                <div className="check_all">
                    <input className={this.id} type="checkbox" name="check_all_box" id="check_box_all"/>
                    <label className={this.id} htmlFor="check_box_all">Seleccionar todos</label>
                </div>
                <div className="button_design"
                    id={this.id}
                onClick={(e)=>{this.onsendData(e)}}>Enviar</div>
                {/* <input type="text" placeholder="Buscar Contacto"/> */}
            </div>
        )
    }
}
export default Filter;