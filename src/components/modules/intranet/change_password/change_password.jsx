import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';
import Title from '../../../render/intranet/all/title_def';

import FormPassword from '../../../render/intranet/change_password/password_form.jsx';

import '../../../../sass/modules/intranet/change_password/change_password.sass';

class changePassword extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="change_password">
                <Header selected="" />
                <div className="content_page">
                    <Title title="Cambiar Contraseña" />
                    <FormPassword/>
                </div>
            </div>
        );
    }
}

export default changePassword;