import React, { Component } from 'react';

import Svg_image from './../../../../../../icons/svg_image.svg'
import global from '../../../../../../../providers/global.static.jsx';
import Svg_check from './../../../../../../icons/svg_check.svg';
import Utils from '../../../../../../utils/utils';
import Buttons from  './buttons';
//import '../../../../sass/modules/intranet/news/list.sass';
import {
    Input,Preloader
} from './../../../../../lib/react-materialize/form_materialize'

class Sponsor extends Component {
    constructor(props){
        super(props);

        this.state={
            id: "",
            link: "",
            src: "",
            status: "",
            action: "save"
        }
        this.utils = new Utils();
        this.onChange        = this.onChange.bind(this);
        this.onClickGeneral  = this.onClickGeneral.bind(this);
        this.clickContentImg = this.clickContentImg.bind(this);
        this.file            = null;
    }
    resize(){
        let content_img = getComputedStyle(this.content_img)
        let height = parseInt(content_img.width)*0.8;
        this.content_img.style= `height : ${height};`;
        // window.addEventListener("resize",()=>{
        //     let height = parseInt(content_img.width)*0.8;
        //     this.content_img.style= `height : ${height};`;
        // })
    }
    componentDidMount(){
        this.resize()
        this.setState({
            id: this.props.element.id,
            status: this.props.element.status,            
            link: this.props.element.link,
            src : this.props.element.src=="empty"?"":this.props.element.src
        })
        if(this.state.src){// si hay url en src -> view preloader
            this.content_img.classList.add("loading")
        }
        this.verifyImage()
    }
    componentDidUpdate(){
        this.resize()
        if(this.state.src&&!this.content_img.classList.contains("load")){// si hay url en src -> view preloader
            this.content_img.classList.add("load")
            this.content_img.classList.add("loading")
        }
        if(this.state.action =="save"){
            this.sponsor.classList.remove("editable_sponsor")
        }else{
            this.sponsor.classList.add("editable_sponsor")
        }
        this.verifyImage()
    }
    componentWillReceiveProps(nextProps){// por si acaso xd :v
        this.setState({
            id: nextProps.element.id,
            status: nextProps.element.status,
            link : nextProps.element.link=="empty"?"":nextProps.element.link,
            src : nextProps.element.src=="empty"?"":nextProps.element.src
        })
        //document.createElement('')
        // evt.dataTranfer
    }
    
    render() {
        return (
            <div className="sponsor" 
                    onClick={this.onClickGeneral.bind(this)}
                    ref = {(ref)=>{ this.sponsor = ref}}
                   >
                <div className="content_selected">
                    <Svg_check/>
                </div>
                <div className="content_img z-depth-3" 
                        ref={ (element)=> { this.content_img = element} }
                        onClick={this.clickContentImg}>
                    <Svg_image className="svg_img"/>
                    
                    <img  className="img" 
                        draggable="false"
                        src={
                            (this.state.src)?//si no hay archivo, pero si hay extension
                            global.URBBASERESOURCE+"/sponsors/"+this.clearIdUUID(this.state.id)+this.state.src
                            :""    
                        } 
                        onLoad={this.onLoadImage.bind(this)}
                        alt="img_sponsor" 
                        ref={(ref)=>{this.image=ref}}/>
                            
                    <input type="file" name="src" id="src" 
                            // value={this.state.src}
                            ref={(ref)=>{this.input = ref}}
                            onChange={this.onChangeImg.bind(this)}/>
                    <div className="content_preloader">
                        <Preloader size="normal" 
                                color="yellow" />
                    </div>
                </div>
                <div className="url-buttons">
                    <Input id="link" 
                            name="link" 
                            type ="text" 
                            label="Link del auspiciador" 
                            value={this.state.link} 
                            onChange={this.onChange} 
                            className="input" />
                    <Buttons changeAction={this.changeAction.bind(this)}
                                updateSponsor={this.updateSponsor.bind(this)}
                                getArrayIdsLength={this.props.getArrayIdsLength}/>
                </div>
                
            </div>
        );
    }
    changeAction(action){
        this.setState({
            action : action
        })
    }
    
    onLoadImage(){
        this.content_img.classList.add("load")
        this.content_img.classList.remove("loading")
        this.verifyImage()
        
    }
    onClickGeneral(e){
        let hasSponsorInEdit=document.querySelector(".sponsor.editable_sponsor");
        if(!e.target.classList.contains("content_buttons")
            &&!this.sponsor.classList.contains("editable_sponsor")
            &&!hasSponsorInEdit){
            if(!this.sponsor.classList.contains("selected")){
                this.props.addIdToArray(this.state.id)
                //this.props.increaseCount();   
            }else{
                this.props.removeIdToArray(this.state.id)
                //this.props.decreaseCount();
            }
            this.sponsor.classList.toggle("selected")
        }else if(hasSponsorInEdit
                &&!e.target.classList.contains("content_buttons")
                &&!this.sponsor.classList.contains("editable_sponsor")){
                Materialize.toast("No puede Seleccionar elementos mientras edita otros",3000)
        }
    }
    clickContentImg(){
        this.input.click()
    }
    onChangeImg(e){
        let types = ['image/png', 'image/jpeg', 'image/raw', 'image/jpg'];
        let input = e.target;
        if (input.files && 
                input.files[0]&&
                (types.indexOf(input.files[0].type) != -1)) {
            this.file = input.files[0]
            this.state.src = this.file.name.split(".")[1] // sin state para que no re-renderize :'v
            let reader = new FileReader();
            reader.onloadend = (e) =>{
                this.image.src = e.target.result
                
                this.verifyImage()
            }
            
            reader.readAsDataURL(input.files[0]);
        }
        //else{
        //     Materialize.toast("Tipo de img no valida :'>", 3000)
        // }
        // this.onChange(e);
    }
    onChange(e){
        let key= e.target.name;
        let value=e.target.value;
        this.setState({
            [key] : value
        });
        
    }
    
    verifyImage(){
        if(this.image.src){
            //  this.content_img.classList.add("load")
            let width =getComputedStyle(this.image).width;
            let height =getComputedStyle(this.image).height;
            if(height > width) {
                this.content_img.classList.add("vertical");
            }else{
                this.content_img.classList.remove("vertical");
            }
        }
    }
    
    updateSponsor(){
        let form = new FormData();
        this.content_img.classList.add("loading")// mostrar el preloader
        form.append("id", this.state.id)
        form.append("status",this.state.status)
        form.append("src",this.state.src?this.state.src:"empty")
        form.append("link",this.state.link?this.state.link:"empty")
        if(this.file&&this.file.name)   {
           form.append("file",this.file) 
        }
        
        let input_text = this.sponsor.querySelector(".url-buttons .input")
        input_text.setAttribute("disabled",true)
        this.input.setAttribute("disabled",true)
        let content_buttons = this.sponsor.querySelector(".url-buttons .content_buttons")
        setTimeout(() => {
            Materialize.toast("Subida de archivos iniciada",2000)
            }, 500);
        this.utils.doQuery("/intranet/sponsor/update", form)
        .then((response)=>{
            this.content_img.classList.remove("loading")// quitar el loader
            if(response){
                this.changeAction("save")
                setTimeout(() => {
                    Materialize.toast("Se actualizó correctamente",3000)
                    }, 500);
                // this.setState({
                //     src : "blob"
                // })
                this.props.fetchSponsors()
            }else{
                setTimeout(() => {
                    Materialize.toast("Hubo problemas al actualizar",3000)
                    }, 500);
                this.setState({
                    src : "empty"
                })
            }
            this.file=null; //por s
            this.input.value="" 
            // this.setState({
            //     src : this.state.src!="empty"?"blob":"empty"
            // })
            this.input.removeAttribute("disabled")// para validar mejor :'v
            input_text.removeAttribute("disabled")
            // if(this.file&&this.file.name)   {
            //     this.setState({
            //         src : "blob"
            //     })
            //  }
            content_buttons.classList.remove("upload-img")
            this.changeAction("save")
        })
    }
    clearIdUUID(id){
        id = id.replace(/-/g,"");
        return id;
    }

}

export default Sponsor;