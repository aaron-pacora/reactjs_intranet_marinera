import React, { Component } from 'react';

import Tab from '../../../render/intranet/contacts/index/tabs_contact.jsx';
import Header from '../../../layouts/intranet/header';

import Title from '../../../render/intranet/all/title_def';
import Utils from '../../../../utils/utils';

import '../../../../sass/modules/intranet/contacts/index.sass';

class Contact extends Component{
    constructor(){
        super();
        this.state = {
            filter_name:null,
            ServiceEmails:null,
            DetailEmails:null
        }
        
        this.utils = new Utils();
        this.utils.doQuery("/intranet/contactos")
        .then(rpta => {
            var dataServiceEmail = JSON.parse(rpta.dataServiceEmails);
            var dataDetailEmail = JSON.parse(rpta.dataDetailEmails);            
            this.setState({ ServiceEmails:dataServiceEmail,DetailEmails:dataDetailEmail});
        })
    }   
    render(){
        return(
            <div className="index_contact">
                    <Header selected="contacts" />
                {
                    (()=>{
                        if (this.state.ServiceEmails != null) {
                                return <div className="content_page">
                                    <Title
                                        title="Contactos"
                                    />
                                    <Tab
                                        ServiceEmail={this.state.ServiceEmails}
                                        DetailEmail={this.state.DetailEmails}
                                    />
                                </div>;
                }else{
                        return (
                            <div className="preloader-wrapper active">
                                <div className="spinner-layer spinner-blue-only">
                                    <div className="circle-clipper left">
                                        <div className="circle"></div>
                                    </div><div className="gap-patch">
                                        <div className="circle"></div>
                                    </div><div className="circle-clipper right">
                                        <div className="circle"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    })()
                }
        </div>)
    }
}
export default Contact;