import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';
import Form from '../../../render/intranet/information/form/form.jsx'
import '../../../../sass/modules/intranet/information/form.sass';


class formInformation extends Component {
    render() {
        return(
            <div className="form_information">
                <Header selected="information" />
                <div className="content_page">
                    <Form />
                </div>
            </div>
        );
    }
}

export default formInformation;
