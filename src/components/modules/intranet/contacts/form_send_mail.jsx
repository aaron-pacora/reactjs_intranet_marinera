import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';

import Title from '../../../render/intranet/all/title_def';

import Utils from '../../../../utils/utils';

import '../../../../sass/modules/intranet/contact_send_mail/index.sass';

class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.onSubmit = this.onSubmit.bind(this);
        this.array = JSON.parse(atob(this.props.match.params.id));
        this.st_asunto=false;
        this.st_message=false;
        this.asunto=null;
        this.message = null;
        this.para = this.array.checks;
        this.table_name = this.array.table_name;
        this.description = this.array.description;
    }
    componentDidMount(){
        let localData = [];
        this.array.checks.forEach(element => {
            localData.push({
                tag: element
            });
        });
        let tempData = this.para;
        $(document).ready(function() {
            $('.chips-initial').material_chip({
                data: localData
            });
            $('.chips-initial').find('input').remove();
            $('.chip').find('.close').on("click",function(){
                let cont = 0;
                $('.chip').find('.close').each(function(){
                    cont = cont +1;
                });
                if (cont == 1) {
                    $('.chip').find('.close').remove();
                }
            });
            $('.chips').on('chip.delete', function (e, chip) {
                var index = tempData.indexOf(chip.tag);
                tempData.splice(index,1);
            });
        });
    }
    validateData(e){
        return !!e.target.value.trim();
    }
    onChangeData() {
        let withData = this.st_asunto && this.st_message;
        withData ? $('button#enviar').addClass("send_button") : $('button#enviar').removeClass("send_button");
    }
    onSubmit(e){
        e.preventDefault();
        if (this.asunto.value != null && this.message.value !=null) {
            if (this.st_asunto && this.st_message){
                let dataForm = new FormData();
                dataForm.append('contacts'      , this.para);
                dataForm.append('affair'        , this.asunto.value);
                dataForm.append('text'          , this.message.value);
                dataForm.append('type'          , this.table_name);
                this.utils.doQuery("/intranet/contactos/send",dataForm)
                .then((response)=>{
                    if (response){
                        $('.send_button').blur();
                        Materialize.toast('El correo se envió correctamente', 4000);
                        setTimeout(() => {
                            window.location.href = "/contactos";   
                        }, 3000);
                    }else{
                        Materialize.toast('Hubo error al enviar el correo', 4000);
                    }
                });
            }
        }
    }
    render(){
        return(
            <div className="index_send_mail">
                <Header header="contacts"/>
                <form onSubmit={this.onSubmit} encType="multipart/form-data">
                    <div className="content_page">
                        <div className="uppart">
                            <Title
                                title="Enviar Correo"
                            />
                            <div className="button_uppart">
                                <button id="enviar" type="submit" className="button_design">
                                    Enviar
                                </button>
                                <a href="/contactos">
                                    <button className="button_design cancel_button">
                                        Cancelar
                                    </button>
                                </a>
                            </div>
                        </div>
                        {
                            (()=>{
                                if (this.table_name == "table_detail") {
                                    return(
                                        <div className="contact_to">
                                            <span className="letter_to_mail">Mensaje recibido:</span>
                                            <textarea className="materialize-textarea recieved" type="text" disabled = "disabled" value = {this.description}/>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div style={{display: "none"}}></div>
                                    )
                                }
                            })()
                        }
                        <div className="contact_to">
                            <span className="letter_to_mail">Para:</span>
                            <div className="chips chips-initial"></div>                  
                        </div>
                        <div className="contact_to">
                            <span className="letter_to_mail">Asunto:</span>
                            <input  type="text" 
                                    id="asunto" 
                                    onKeyUp={(e) => { this.st_asunto = this.validateData(e); this.onChangeData()}}
                                    ref={(input)=>{this.asunto = input;}}
                            />
                        </div>
                        <div className="contact_to">
                            <span className="letter_to_mail">Mensaje a enviar:</span>
                            <div className="input-field col s12">
                                <textarea   id="textarea1" 
                                            className="materialize-textarea"
                                            onKeyUp={(e) => { this.st_message = this.validateData(e); this.onChangeData() }}
                                            ref={(input) => { this.message = input; }}
                                >
                                </textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
export default SendEmail;