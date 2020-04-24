import React, { Component } from 'react';
import IconDelete   from '../../../../../icons/svg_delete.svg';
import IconSend     from '../../../../../icons/svg_send.svg';
import Filter from './filter';

var idlabel = null;
class Table extends Component{
    constructor(props){
        super(props);
        this.id_card = null;
        this.onSendThisContact = this.onSendThisContact.bind(this);
        this.Delete = this.props.TableonDelete;
        this.state = {
            data: this.props.ServiceEmails,
            id:this.props.idname,
            name: "",
            idContact: "",
            mensaje : this.props.msj
        }
    }
    componentDidMount(){
        $(document).ready(function () {
            $(document).ready(function () {
                $('.modal').modal();
            });
            var check = $('#check_box_all'); 
            check.on("click",function() {
                var arrayAllCheckBox = [];
                if (!check.is(':checked')) {
                    $("input[name='status']").each(function () {
                        arrayAllCheckBox.push($(this).prop("checked"));
                        $(this).prop("checked", false)
                    })
                }
                else {
                    $("input[name='status']").each(function() {
                        arrayAllCheckBox.push($(this).prop("checked"));
                        $(this).prop("checked",true)
                    })
                }
            });
            var check_box = $('input.table_detail');
            check_box.remove();
            $('label.table_detail').remove();
            $('div#table_detail.button_design').remove();
        });
    }
    onSendThisContact(email,table_name,description){
        var arrayEmail = [];
        var toSend = {};
        arrayEmail.push(email);
        toSend.checks = arrayEmail;
        toSend.table_name = table_name;
        toSend.description = description;
        var json = JSON.stringify(toSend);
        var encript = btoa(json);
        window.location.href = "/contactos/" + encript;
    };
    onDelete(id,nameContact,type){
        this.Delete(id,nameContact,type);
    };
    render(){
        return(
            <div id={this.state.id} className="table">
                <Filter
                    idname={this.state.id}
                />
                {
                    (() => {
                        if (this.state.data.length != 0) {
                            var element = this.state.data.map((el) => {
                                idlabel = el.id;
                                return (
                                    <div className="card_contact" key={el.id} id={el.id}
                                        // onClick={(e)=>{this.Send_for_one(el.id)}}    
                                    >
                                        <div className="checkbox_table">
                                            <input type="checkbox" 
                                                    id={el.id}
                                                    name="status"
                                                    className={this.state.id}/>
                                            <label id="" className={this.state.id} htmlFor={el.id}></label>
                                            {(el.created_at).slice(0, 10)}
                                        </div>
                                        <div className="name">
                                            {(el.name).toUpperCase()}
                                        </div>
                                        <div className="email">
                                            {el.email}
                                            <div className="options_table">
                                                <a id= {this.state.id}
                                                    onClick={(e)=>{
                                                        this.onSendThisContact(el.email, this.state.id,el.description)
                                                }} className="icon_option" title="Enviar">
                                                    <IconSend />
                                                </a>
                                                <div className="icon_option modal-trigger" title="Eliminar" href="#popupdelete" onClick={() => {
                                                    this.onDelete(el.id, el.name,this.state.id)
                                                }}>
                                                    <IconDelete />
                                                </div>
                                            </div>
                                        </div>
                                    </div>                           
                                )
                            })
                            return element;
                        }
                        return(
                            <div className="without_contact">
                                <span>{this.state.mensaje}</span>
                            </div>
                        )
                    })()
                }
            </div>
        )
    }
}
$(document).ready(function () {
    var clicked_one_one = []
    var clicked_checked_one = []
    $(".checkbox_table").find('label').on("click", function () {

        $("input[name='status']").each(function () {
            clicked_one_one.push($(this).val());
        });
        $("input[name='status']:checked").each(function () {
            clicked_checked_one.push($(this).val());
        })
        if (clicked_checked_one.length == clicked_one_one.length) {
            $('#check_box_all').prop("checked", true);
        } else {
            $('#check_box_all').prop("checked", false);
        }
        clicked_one_one = [];
        clicked_checked_one = [];
    });
});
export default Table;

