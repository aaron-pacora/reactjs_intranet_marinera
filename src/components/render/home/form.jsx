import React, { Component } from 'react';

import Utils from '../../../utils/utils';

class Form extends Component {
    constructor(){
        super();
        this.state = {
            username: "",
            password: "",
            on_login: false
        };
        this.uername = "";
        this.password = "";
        this.utils = new Utils();
    }

    onSubmit(e){
        e.preventDefault();
        this.setState({
            on_login: true
        });
        let data = new FormData();
        data.append("username",this.state.username);
        data.append("password", this.state.password);

        this.utils.doQuery("/login",data)
        .then((rpta) => {
            if(rpta.error != undefined){
                $("label").removeClass("active");
                $(".valid").removeClass("valid");
                Materialize.toast(rpta.error, 4000);
                this.setState({
                    on_login: false
                });
            } else if (rpta.errorserver != undefined){
                $("label").removeClass("active");
                $(".valid").removeClass("valid");
                Materialize.toast(rpta.errorserver, 4000);
                this.setState({
                    on_login: false
                });
            }else{
                Cookies.set('_svaf', rpta.token);
                window.location.href = "/noticias";
            }
            this.setState({
                username: "",
                password: ""
            });
        });
    }

    render() {
        return (
            <div className="form">
                <form action="/" onSubmit={this.onSubmit.bind(this)}>
                    <div className="content_inputs">
                        <div className="input-field">
                            <input id="username"
                                    value={this.state.username}
                                    onChange={(text) => { this.setState({ username: text.target.value})}}
                                    type="text"/>
                            <label htmlFor="username">Usuario</label>
                        </div>
                        <div className="input-field">
                            <input id="password"
                                    value={this.state.password}
                                    onChange={(text) => { this.setState({ password: text.target.value })}}
                                    type="password"
                                    className="validate"/>
                            <label htmlFor="password">Contraseña</label>
                        </div>
                    </div>
                    <div className="content_btn">
                        {
                            (()=>{
                                if(this.state.on_login){
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
                                    return <button className="button_design waves-effect waves-light">Entrar</button>;
                                }
                            })()
                        }
                    </div>
                </form>
            </div>
        );
    }
}

export default Form;