import React, { Component } from 'react';

import Utils from '../../../../utils/utils';

class FormPassword extends Component {
    constructor(props) {
        super(props);
        this.onSubmit             = this.onSubmit.bind(this);
        this.st_old               = false;
        this.st_new               = false;
        this.st_repeat            = false;
        this.st_eq_password       = false;
        this.st_correct_password  = false;
        this.focus_lost_main_pssw = false;
        this.state                = {
            sendData: false
        };
        this.utils = new Utils();
    }

    equalsPassword(){
        this.st_eq_password = this.inp_new.value == this.inp_repeat.value;
        this.st_eq_password ? this.div_policy.classList.remove("error_equal") : this.div_policy.classList.add("error_equal");
    }

    onSubmit(evt){
        evt.preventDefault();
        if (this.st_new && this.st_repeat && this.st_eq_password && this.st_correct_password){
            this.setState({ sendData: true});
            let dataForm = new FormData();
            dataForm.append("old_password",this.inp_old.value);
            dataForm.append("new_password", this.inp_new.value);
            dataForm.append("repeat_password", this.inp_repeat.value);
            this.utils.doQuery("/intranet/cambiar_contrasenia", dataForm)
            .then((response) => {
                this.setState({ sendData: false});
                let msnToast = "¡Ha ocurrido un error!";
                if(response){
                    msnToast = "Se actualizó correctamente.";
                }
                this.btn_save.classList.remove("_complete");
                this.inp_old.value = "";
                this.inp_new.value = "";
                this.inp_repeat.value = "";
                Materialize.toast(msnToast, 4000);
            });
        }
    }

    onChangeData(){
        let withData = this.st_new && this.st_repeat && this.st_eq_password && this.st_correct_password;
        !(this.st_new || this.st_repeat) ? this.div_policy.classList.add("error_chars") : this.div_policy.classList.remove("error_chars");
        withData ? this.btn_save.classList.add("_complete") : this.btn_save.classList.remove("_complete");
    }

    validateCorrectPassword(password){
        let capitalLetter = password.replace(/[A-Z]/g,"");
        let status_cl = password == capitalLetter;
        
        status_cl ? this.div_policy.classList.add("error_min_cl") : this.div_policy.classList.remove("error_min_cl");

        let number = password.replace(/[0-9]/g,"");
        let status_number = password == number;
        status_number ? this.div_policy.classList.add("error_min_num") : this.div_policy.classList.remove("error_min_num");
        this.st_correct_password = !status_cl && !status_number;

        this.onChangeData();
    }

    keyUpStatus(e){
        return e.target.value.trim().length >= 8;
    }

    render() {
        return (
            <form className="password_form" onSubmit={this.onSubmit} encType="multipart/form-data" >
                <div>
                    <div className="input-field">
                        <input name="subtitle"
                            type="password"
                            id="old_passwod"
                            onKeyUp={(e) => { this.st_old = !!e.target.value.trim();}}
                            ref={(input) => { this.inp_old = input; }} />
                        <label htmlFor="old_passwod">Contraseña antigua</label>
                    </div>
                    <div className="input-field">
                        <input name="subtitle"
                            type="password"
                            id="new_passwod"
                            onChange={(e) => { this.validateCorrectPassword(e.target.value);}}
                            onBlur={(e) => { this.focus_lost_main_pssw = true}}
                            onKeyUp={(e) => { this.st_new = this.keyUpStatus(e);
                                            this.focus_lost_main_pssw ? this.equalsPassword():'';
                                            this.onChangeData();}}
                            ref={(input) => { this.inp_new = input; }} />
                        <label htmlFor="new_passwod">Nueva contraseña</label>
                    </div>
                    <div className="input-field">
                        <input name="subtitle"
                            type="password"
                            id="repeat_passwod"
                            onKeyUp={(e) => { this.st_repeat = this.keyUpStatus(e);
                                            this.equalsPassword();
                                            this.onChangeData(); }}
                            ref={(input) => { this.inp_repeat = input; }} />
                        <label htmlFor="repeat_passwod">Repetir nueva contraseña</label>
                    </div>
                </div>
                <div className="password_policy" ref= {(div)=>{this.div_policy = div}}>
                    <span className="msn_equals_password"> - No coinciden la nueva contraseña - </span>
                    <br/>
                    <span className="msn_min_chars">* Mínimo 8 caracteres</span>
                    <br/>
                    <span className="msn_capital_letter">* Al menos 1 mayúscula</span>
                    <br/>
                    <span className="msn_min_num">* Al menos 1 número</span>
                </div>
                <div>
                    {
                        (()=>{
                            if(this.state.sendData == true){
                                return <div className="preloader-wrapper medium active">
                                    <div className="spinner-layer">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div><div className="gap-patch">
                                            <div className="circle"></div>
                                        </div><div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                </div>;
                            }else{
                                return <button className="button_design _save waves-effect waves-light" ref={(btn) => { this.btn_save = btn; }}>Guardar</button>;
                            }
                        })()
                    }
                </div>
            </form>
        );
    }
}

export default FormPassword;
