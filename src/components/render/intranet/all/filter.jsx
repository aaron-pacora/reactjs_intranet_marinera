import React, { Component } from 'react';

import IconSearch from '../../../../icons/svg_search.svg';
//import IconDate from '../../../../icons/svg_calendar.svg';

class Filter extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: '1',
        };
        this.data=this.props.data;
        this.title_filter=this.data.title_filter||"configure name";
        this.button_text=this.data.button_text||"config text button";
        this.path=this.data.path||""
    }
    changeShow(show) {
        this.setState({ show: show });
    }

    // función que va al evento "onKeyUp" del tag Input
    // por cada vez que se teclea, se pide el código de la tecla
    // si es 13 (código ASCII del enter) ejecutará la función del
    // props que llegó como parámetro "fnGetNotices"
    onEnterDetected(e){
        let getDate=this.props.fnGetNotices||this.props.fnGetContests;
        if (e.keyCode === 13){
            getDate(e.target.value);
        }
    }

    render() {
        return (
            <div className="filter">
                <div className="content_inputs">
                    <div className="input-field">
                        <input id="title_filter" type="text" onKeyUp={(e)=>{this.onEnterDetected(e)}}/>
                        <label htmlFor="title_filter">{ this.title_filter}</label>
                        <div className="icon_inp">
                            <IconSearch/>
                        </div>
                    </div>
                    {/* <div className="input-field">
                        <input id="date_filter" type="text" />
                        <label htmlFor="date_filter">Seleccione Fecha</label>
                        <div className="icon_inp">
                            <IconDate/>
                        </div>
                    </div> */}
                </div>
                <div className="content_btn">
                    <a href={this.path}>
                        <button className="button_design waves-effect waves-light">{ this.button_text}</button>
                    </a>
                </div>
            </div>
        );
    }
}

export default Filter;
