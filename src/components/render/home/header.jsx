import React, { Component } from 'react';

import global from '../../../../providers/global.static.jsx';

class Header extends Component {
    constructor(props){
        super(props);
        this.state ={
            image: "",
            src_logo: this.props.src_logo
        };
    }

    render() {
        return (
            <div className="header">
                <div className="content_header">
                    <div className="content_dist_icon">
                        <div className="icon_content">
                            <img className={this.state.image} src={global.URBBASERESOURCE+"/logo/logo"+this.state.src_logo} alt="fireSpot" ref={(img)=>{
                                if (!img) { return; }
                                img.onload = () => {
                                    if (img.complete) {
                                        this.setState({ image: "view" });
                                    }
                                };
                            }}/>
                        </div>
                    </div>
                    <div className="content_title">
                        <div className="title">
                            <span>Valores y Sentimiento del Perú</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;