import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import global from '../../../../../../providers/global.static.jsx';
import IconImage from '../../../../../icons/svg_image.svg';
import Organizers from './../modal_organizers/index';

import Utils from '../../../../../utils/utils';

import Svg_unfold_more from './../../../../../icons/svg_unfold_more.svg';
import Svg_unfold_less from './../../../../../icons/svg_unfold_less.svg';
import {
    Input,TextArea,DatePicker,Select,Preloader
} from './../../../../lib/react-materialize/form_materialize'

class FormContest extends Component {
    constructor(props) {
        super(props);
        this.redirect=false;
        this.data={};
        this.state={
            name          : "",
            place         : "",
            date          : "",
            description   : "",
            organizer_id  : "",
            organizer_data: [],
            show_organizer: false
        }
        this.utils = new Utils();
        this.onChange=this.onChange.bind(this);
        this.fetchOrganizers()
        this.clearModalOrganizer = this.clearModalOrganizer.bind(this)
    }
    componentDidMount(){
        $(document).ready(()=> {
            //$('.modal').modal();
            $('.modal').modal({
                dismissible: true, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                inDuration: 300, // Transition in duration
                outDuration: 200, // Transition out duration
                startingTop: '4%', // Starting top style attribute
                endingTop: '10%', // Ending top style attribute
                ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                //   alert("Ready");
                },
                complete: this.clearModalOrganizer  // Callback for Modal close
              }
            );
        });
        this.verifySrc()
    }
    clearModalOrganizer(){
        this.setState({
            show_organizer : false
        })
    }
    componentDidUpdate(){
        this.verifySrc();
        let button_save=document.querySelector("._save");
        if (button_save) {
            if(this.completeInputs()){
                button_save.classList.add("_complete");
            }else{
                button_save.classList.remove("_complete");
            }
        }
        
    }
    verifySrc(){
        let img =document.querySelector(".content_img img")
        if(img!=null){
            if(img.getAttribute("src")){
                img.parentElement.classList.add("load");
            }else{
                img.parentElement.classList.remove("load");
            }
        }
    }
    completeInputs(){
        let object=this.state;
        let count=0;
        for (const key in object) {
            if (object.hasOwnProperty(key)&&object[key]&&(key!="organizer_data")&&(key!="show_organizer")) count++;
        }
        if(count==5)return true;
        return false;
    }
    componentWillReceiveProps(nextProps){
        let nextState=nextProps;
        this.data=nextState.dataContest;
        if(this.data){
            this.setState({
                name: this.data.name,
                place: this.data.place,
                date: this.parseToString(this.data.date),
                description: this.data.description,
                organizer_id: this.data.organizer_id,
            });
        }
    }
    fetchOrganizers(){
        this.utils.doQuery("/intranet/organizer/index")
        .then((response)=>{
            this.setState({
                organizer_data: response
            })
        });
    }
    clearIdUUID(id){
        id = id.replace(/-/g,"");
        return id;
    }
    onChange(e){
        let key = e.target.name;
        let value = e.target.value;
        this.setState({
            [key] : value
        });
    }
    parseToDate(value){
        if(value=="") return "";
        let arrayMonth = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
        let date = value.split(" ");
        let day = date[0];
        day = this.completeZeroLeft(day);
        // day = day.length==2?day:("0"+day)
        let month = parseInt(arrayMonth.indexOf(date[1].split(",")[0]))+1;//por la coma :v
        month = this.completeZeroLeft(month)
        // month = (month+"").length==2?month:("0"+month)
        let year = date[2]
        let time_stamp = `${year}-${month}-${day}`// mi formateo :'v
        // let time_stamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000000`// mi formateo :'v
        //2018-06-11 17:46:13.872289
        return time_stamp;
    }
    completeZeroLeft(number){
        return (number+"").length==2?number: "0"+number
    }
    parseToString(time_stamp){
        //2018-06-11
        
        let arrayMonth = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
        let date = time_stamp.split("-")
        let day = parseInt(date[2])
        let month = arrayMonth[parseInt(date[1])-1]
        let year = date[0]

        let value = `${day} ${month}, ${year}`// mi formateo :'v
        return value;
        // 13 Junio, 2018
    }
    render() {
        if (this.redirect) {
            return <Redirect to='/concursos' />;
        }
        
        return (
            <form className="form" onSubmit={ (e)=>e.preventDefault()} encType="multipart/form-data" >
                <div className="content_contest">
                    <Input id="name" 
                            name="name" 
                            type ="text" 
                            label="Nombre" 
                            value={this.state.name} 
                            onChange={this.onChange}/>
                    <Input id="place"
                            name="place" 
                            type ="text" 
                            label="Lugar" 
                            value={this.state.place}
                            onChange={this.onChange}/>
                    <DatePicker id="date" 
                            name="date" 
                            label="Día" 
                            value={ //!this.state.date||validator.isAlphanumeric(this.state.date.replace(",","").replace(/ /g,""))?//thanks validator :')
                            //             this.state.date:
                                        this.state.date} 
                            onChange={this.onChange} 
                            />
                    <TextArea id="description" 
                            name="description" 
                            label="Descripción" 
                            value={this.state.description} 
                            onChange={this.onChange} 
                            data-length="120"
                            maxLength="120"
                            />
                    
                </div>
                
                <div className="content_organizer">
                    <div className="content_svg_unfold_more">
                        <Svg_unfold_more className="svg_unfold_more modal-trigger"
                                            href="#popup_organizer"
                                            onClick={this.eventOrganizer.bind(this)}/>
                    </div>
                    <div className="content_img z-depth-5">
                        <IconImage/>
                        <img src={
                                    (this.catchOrganizer().src)?//si no hay archivo, pero si hay extension
                                    global.URBBASERESOURCE+"/organizers/"+this.clearIdUUID(this.state.organizer_id)+this.catchOrganizer().src
                                    :""
                                }
                                alt="img_organizer" 
                                href={this.catchOrganizer().link}
                                onLoad={this.loadImage}
                                />
                    </div>
                    {
                        (this.state.organizer_data)?
                                <Select  
                                        id="organizer_id" 
                                        name="organizer_id" 
                                        value={this.state.organizer_id} 
                                        onChange={this.onChange} 
                                        className="icons"
                                        placeHolder="Seleccione Organizador"
                                        options={[
                                            ...(this.state.organizer_data
                                                        .filter((element)=>element.src!="empty")
                                                        .map((element)=>{
                                                        return {
                                                            "data-icon": global.URBBASERESOURCE+"/organizers/"+this.clearIdUUID(element.id)+element.src,
                                                            text: element.name,
                                                            value: element.id,
                                                            key: element.id+element.src,
                                                            className:"left "
                                                        }
                                                    })
                                                )
                                        ]}  />   
                        
                                :""
                    }
                    
                
                </div>
                <div className="content_buttons">
                    <button className="button_design _save waves-effect waves-light" 
                           onClick={this.onSubmit.bind(this)} >Guardar</button>
                    <button className="button_design _cancel waves-effect waves-light modal-trigger" 
                            href="#popup_cancel">Cancelar</button>  
                    <Preloader size="normal" 
                            color="blue" />
                    
                </div>
                <div id="popup_cancel" className="modal">
                    <div className="modal-content">
                        <h4>¿Desea cancelar?</h4>
                        <div className="line_modal"></div>
                        <span>Los datos agregados se perderán.</span>
                    </div>
                    <div className="modal-footer">
                        <div className="modal-action modal-close waves-effect waves-green btn" onClick={() => { this.onClickCancel() }}>Sí</div>
                        <div className="modal-action modal-close waves-effect waves-green btn">No</div>
                    </div>
                </div>
                <div id="popup_organizer" className="modal "
                        ref={(ref)=>{this.modal_organizer=ref}}>
                    <div className="modal-content">
                        <div className="content_svg_close modal-close">
                            <Svg_unfold_less className="svg_close"/>
                        </div>
                        {
                            this.state.show_organizer?
                            <Organizers fetchOrganizers={this.fetchOrganizers.bind(this)}/>
                            :""
                        }
                    </div>
                </div>
            </form>
        );
    }

    eventOrganizer(){// pa que se renderize bien las imagenes :'v
        this.setState({
            show_organizer : true
        })
        this.modal_organizer.classList.add("modal-organizer")
        
    }
    onSubmit(e){
        if(this.completeInputs()&&this.data){
            e.target.parentElement.classList.add("show-preloader")
            if(Object.keys(this.data).length){// si hay algo significa que es update
                this.onUpdate();
            }else{
                this.onCreate();
            }
        }
    }
    onClickCancel(){
        this.redirect=true;
        this.setState({});
    }
    onCreate(){
        let form= new FormData();
        form.append("name",this.state.name);
        form.append("place",this.state.place);
        form.append("date",this.parseToDate(this.state.date));
        form.append("description",this.state.description);
        form.append("organizer_id",this.state.organizer_id);
        this.utils.doQuery("/intranet/contest/create", form)
        .then((response)=>{
            //JSON.parse(response)
            this.redirect = true;
            this.setState({})
        });
    }
    onUpdate(){
        let form= new FormData();
        let path=(location.pathname).split("/");
        path= path[path.length-1];
        form.append("id",path)
        form.append("name",this.state.name)
        form.append("place",this.state.place)
        form.append("date",this.parseToDate(this.state.date))
        form.append("description",this.state.description)
        form.append("organizer_id",this.state.organizer_id)
        this.utils.doQuery("/intranet/contest/update", form)
        .then((response)=>{
            //JSON.parse(response)
            this.redirect = true;
            this.setState({})
        });
    }
    catchOrganizer(e){
        let arrayOrganizers=this.state.organizer_data;
        let currentOrganizers=this.state.organizer_id;
        for (const element of arrayOrganizers) {
            if(element.id==currentOrganizers){
                return {
                    src: element.src,
                    link: element.link
                };
            }
        }
        return {
            src: "",
            link: ""
        };
    }
    loadImage(e){
        let img=e.target;
        let CSSOM_img=getComputedStyle(img);
        if(CSSOM_img.width>CSSOM_img.height){
            img.classList.add("horizontal")
            img.classList.remove("vertical")
        }else{
            img.classList.add("vertical")
            img.classList.remove("horizontal")
        }
    }
}

export default FormContest;
