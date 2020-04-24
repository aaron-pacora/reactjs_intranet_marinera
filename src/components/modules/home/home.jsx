import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import Header from '../../../components/render/home/header';
import Footer from '../../../components/render/home/footer';
import Form from '../../../components/render/home/form';

import Utils from '../../../utils/utils';

import '../../../sass/modules/home/index.sass';

var st_conn = !!document.cookie;
class Home extends Component {
    constructor(){
        super();
        this.state = {
            src_logo : null
        };
        this.utils = new Utils();
        this.utils.doQuery("/intranet/main")
        .then((response) => {
            if (response !== false) {
                this.setState({
                    src_logo: response.src_logo
                });
            }
        });
    }

    render(){
        let currentCookie = Cookies.get('_svaf');
        if (currentCookie !== undefined){
            return <Redirect to={"/noticias"}/>;
        }else {
            return(
                <div className="home">
                    {
                        (()=>{
                            if (this.state.src_logo !== null){
                                return <Header src_logo={this.state.src_logo}/>
                            }
                        })()
                    }
                    <div className="content_page">
                        <Form/>
                    </div>
                    <Footer/>
                </div>
            );

        }
    }
}

export default Home;