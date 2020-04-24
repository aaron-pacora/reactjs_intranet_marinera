import React, { Component } from 'react';

import Header from '../../../layouts/intranet/header';
// import Principal from '../../../render/intranet/cover_page/principal/principal'
// import Filter from '../../../render/intranet/cover_page/filter/filter';
import Title from '../../../render/intranet/all/title_def';
import global from '../../../../../providers/global.static.jsx';
import ImageIcon from '../../../../icons/svg_image.svg';
import DeleteIcon from '../../../../icons/svg_close.svg';

import Utils from '../../../../utils/utils';

const Compress = require('compress.js');

import '../../../../sass/modules/intranet/cover_page/index.sass';

class IndexCoverPage extends Component{
    constructor(){
        super();
        this.state={
            img_add   : '',
            img_first : '',
            img_second: '',
            img_third : ''
        }
        this.redirect   = false;
        this.arrayFiles = {
            img_first : '',
            img_second: '',
            img_third : ''
        };
        this.utils           = new Utils();
        this.changeImg       = this.changeImg.bind(this);
        this.queueImg        = this.queueImg.bind(this);
        this.checkAllTime    = this.checkAllTime.bind(this);
        this.fillArray       = this.fillArray.bind(this);
        this.deleteImg       = this.deleteImg.bind(this);
        this.save            = this.save.bind(this);
        this.load_img_bellow = this.load_img_bellow.bind(this);
        this.changeFilter    = this.changeFilter.bind(this);
        this.onDelete        = this.onDelete.bind(this);
        this.fetch_images();
        
    }
    componentDidMount(){
        
        let h=$(".content_img").width();
        $(".content_img").css("height",(h*0.6)+"px")
        h=$(".content_img_selected").width();
        $(".content_img_selected").css("height",(h*0.6)+"px")
        
        $( window ).resize(function() {
            let h=$(".content_img").width();
            $(".content_img").css("height",(h*0.6)+"px")
            h=$(".content_img_selected").width();
            $(".content_img_selected").css("height",(h*0.6)+"px")
        });
        this.checkAllTime();
        
    }
    componentDidUpdate(before_props,before_state){
        if(!(this.compareStates(before_state,this.state))){// importante si no entraria en bucle
            this.clearFilters();
            this.checkAllTime();                           // ya que this.checkAllTime tiene this.setState({})
        }
    }
    compareStates(obj1,obj2){// compara objetos suponiendo que los nombres y nro de propiedades son iguales
        for (const key in obj2) {
            if(obj1[key]!==obj2[key]){
                return false;
            }
        }
        return true;
    }

    fetch_images(){
        this.utils.doQuery("/intranet/img_cover_page")
          .then((rpta) => {
                if(rpta){
                    let data=JSON.parse(rpta.dataCoverPage)
                    this.arrayFiles['img_first']=(data[0]?1+" "+data[0].id:''); /// si existen img que le de su status
                    this.arrayFiles['img_second']=(data[1]?2+" "+data[1].id:'');
                    this.arrayFiles['img_third']=(data[2]?3+" "+data[2].id:'');
                    this.setState({
                        img_first:  data[0]?global.URBBASERESOURCE+"/img_cover/"+data[0].id.replace(/-/g,"")+data[0].src:'',
                        img_second: data[1]?global.URBBASERESOURCE+"/img_cover/"+data[1].id.replace(/-/g,"")+data[1].src:'',
                        img_third: data[2]?global.URBBASERESOURCE+"/img_cover/"+data[2].id.replace(/-/g,"")+data[2].src:''
                        });
                    // this.checkAllTime();
                }
          });
    }
    checkAllTime(){  ///si se llenan las 3 imgs se vacia la de arriba
        let object=this.state;
        let count=0;
        for (const key in object) {
            if(key!='img_add'&&object[key]){
                count++;
                // if(key=="img_third"){///
                // }
            }
        }
        if(count==3){
            this.setState({
                img_add:''
            })
            $(".content_button label").removeClass("_complete2");
            $(".content_button label").prop('for','');
            $(".content_filter button").addClass("_complete");
        }else{
            $(".content_button label").addClass("_complete2");
            $(".content_button label").prop('for', 'cargar');
            $(".content_filter button").removeClass("_complete");
        }
    }
    fillArray(e,key){   ///se llena un array c/u de los files correspondintes a las images insertadas
        // let input=e.target;
        // input.value?this.arrayFiles[]=(e.target.files[0]):'';
        const compress = new Compress()
        const files = [$("input[type=file]")[0].files[0]]
        compress.compress(files, {
            size: 4, // the max size in MB, defaults to 2MB
            quality: .50, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
        }).then((data) => {
            const img1 = data[0]
            const base64str = img1.data
            const imgExt = img1.ext
            const file = Compress.convertBase64ToFile(base64str, imgExt)
                key ? this.arrayFiles[key] = (file):'';
        });
    }
    save(){
        
        let array=this.arrayFiles;
        let dataForm = new FormData();
        // array['img_first']&&(typeof array['img_first']=='string'&&array['img_first']!='')?dataForm.append('first_file', array['img_first']):'';
        array['img_first']?dataForm.append('first_file', array['img_first']):'';
        array['img_second']?dataForm.append('second_file', array['img_second']):'';
        array['img_third']?dataForm.append('third_file' , array['img_third']):'';
        
        let list=$(".content_img img");
        let count=0;
        for (const iterator of list) {
            if ($(iterator).attr("src")!='') {
                count++;
            }
        }
        if(count==3){
            $(".content_filter button").css("display","none");
            $(".content_filter .preloader-wrapper ").css("display","block");
            this.utils.doQuery("/intranet/img_cover_page/guardar_img", dataForm)
            .then((response)=>{
                if (response){
                    this.redirect = true;
                    this.setState({});
                }
            });
        }
    }
    deleteImg(e){
        
        let that=e.target;
        let key=$(that).parent().parent().parent().attr("class");
        let object=this.arrayFiles;
        
        if(typeof object[key] =='string'&&object[key]){// si es un string con valor
            
            let id= object[key].split(" ")[1]// el nro 2 del arreglo generado del split del string del valor de la key del objeto array files
            let dataForm=new FormData();
            dataForm.append('id',id);
            this.utils.doQuery("/intranet/img_cover_page/delete_img", dataForm)
            .then((response)=>{
                if (response){
                    // this.redirect= true;
                    this.setState({
                        [key]: ''
                     });
                }
                // this.checkAllTime();
            });
            
        }else{/// si es un file 
            // this.redirect= true;
            if (true) {
                this.setState({
                    [key]: ''
                });
            }
            // this.arrayFiles[key]=''
            // setTimeout(() => {//no funciona sin esto :( , ni con el componentDidMount
            //     this.checkAllTime()
            // },1000);;
        }
        
        
    }
    render(){
        if (this.redirect) {
            location.reload();
        }
        return (
            <div className="cover_page">
                <Header selected="cover_page"/>
                
                <div className="content_page">
                    <div className="content_title">
                        <Title title='Portada' />
                    </div>
                    <div className="content_principal">
                        <div className="content_img_selected z-depth-3">
                            <ImageIcon/>
                            {
                                this.state.img_add?<img src={this.state.img_add} alt="" onLoad={this.queueImg} />:''
                            }
                             
                        </div>
                        <div className="content_button">
                            
                            <label htmlFor="cargar" className="waves-effect waves-light button_design _save " >Cargar otra imagen
                                <input type="file" name="" id="cargar" onChange={this.changeImg}/>
                            </label>
                        </div>
                    </div>
                    <div className="content_filter">
                        <div className="warning">
                            - Se debe completar las 3 imágenes para poder habilitar "Guardar".<br/>
                            - Para cambiar el orden hacer "click" en la imagen y luego seleccionar el lugar de otra imagen.
                        </div>
                        <div className="content_items">
                            
                            <div className="content_img">
                                
                                {
                                    this.state.img_first?<div className="img_first">
                                    
                                        <div className="content_preloader">
                                            <div className="preloader-wrapper big active">
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
                                        </div>
                                    
                                    <img src={this.state.img_first} onClick={this.changeFilter}  onLoad={this.load_img_bellow} alt=""/><div className="content_svg" onClick={this.onDelete}><div className="content_ref"><DeleteIcon/><div className="content_backgr"></div></div></div></div>:<ImageIcon/>
                                }
                            </div>
                            <div className="content_img">
                                {
                                    this.state.img_second?<div className="img_second">
                                    
                                        <div className="content_preloader">
                                            <div className="preloader-wrapper big active">
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
                                        </div>
                                    
                                    <img src={this.state.img_second} onClick={this.changeFilter} onLoad={this.load_img_bellow}  alt=""/><div className="content_svg" onClick={this.onDelete}><div className="content_ref"><DeleteIcon/><div className="content_backgr"></div></div></div></div>:<ImageIcon/>
                                }
                                
                            </div>
                            <div className="content_img">
                                {
                                    this.state.img_third?<div className="img_third">
                                    
                                        <div className="content_preloader">
                                            <div className="preloader-wrapper big active">
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
                                        </div>
                                    
                                    <img src={this.state.img_third}  onClick={this.changeFilter} onLoad={this.load_img_bellow} alt=""/><div className="content_svg" onClick={this.onDelete}><div className="content_ref"><DeleteIcon/><div className="content_backgr"></div></div></div></div>:<ImageIcon/>
                                }
                            </div>
                            
                                            
                            {/* {
                                this.state.img_cover///rellena las imagenes de abajo
                                .map((data)=>{
                                return <img src={this.path+"img_cover/"+data.img_cover.id.replace(/-/g,"")+data.src} 
                                            alt=""/>}
                                )
                            } */}
                            
                        </div>
                        <div className="content_button_bellow">
                            <button className="waves-effect waves-light button_design _save _complete" 
                                    onClick={this.save}>
                                Guardar
                            </button>
                            <div className="preloader-wrapper big active">
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
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
    load_img_bellow(){
        $(".content_preloader").css("display","none");
        this.checkAllTime();
    }
    onDelete(e){
        let aux=this;
        aux.deleteImg(e);
        
    }
    changeFilter(e){
        /*************** logica de efectos************/
        let count=0;
        let array=$(".content_img img");//esta vaina son las 3 imagenes
        for (const element of array) {
            if($(element).hasClass("color_filter")){
                count++;
            }
        }
        
        if(count===0){// es por primera vez click 
            $(".content_img img").addClass("hover");
            $(e.target).removeClass("hover")
        } else if(count===1&&($(e.target).hasClass("color_filter"))){
            $(".content_img img").removeClass("hover");
            
        }//// es importante el orden de estos ifs!!!!!

        if(count===0||(count===1&&$(e.target).hasClass("color_filter"))){
            $(e.target).toggleClass("color_filter");
        }
        
        /****************logica de cambiazo************/
        if($(e.target).hasClass("hover")){
            let element=$(".color_filter");
            let parent_target=$($(e.target).parent()).attr("class");
            let parent_element=$($(element).parent()).attr("class");
            let state_target=this.state[parent_target]   ;
            let state_element=this.state[parent_element]   ;
            this.setState({
                [parent_target]:state_element,
                [parent_element]:state_target
            })
            
            let array_parent= this.arrayFiles[parent_target];
            let array_element= this.arrayFiles[parent_element];
            this.arrayFiles[parent_target]=(typeof array_element=='string')?this.evalue(parent_target,array_element):array_element;
            this.arrayFiles[parent_element]=(typeof array_parent=='string')?this.evalue(parent_element,array_parent):array_parent;
            
            // this.clearFilters();

        }
        

        
    }
    clearFilters(){
        $(".content_img img").removeClass("hover");
        $(".content_img img").removeClass("color_filter");
    }
    evalue(indicator,word){
        let response="";
        switch (indicator) {
            case 'img_first':
                response+=1;
                break;
        
            case 'img_second':
                response+=2;
            break;
            case 'img_third':
                response+=3;
                break;
        }
        return response+=word.substring(1);
    }

    changeImg(e){
        let input=e.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = (e)=> {
                this.setState({
                    img_add: e.target.result
                });
                
            }
            reader.readAsDataURL(input.files[0]);
        }
        // this.fillArray(e);
    
    }
    queueImg(e){
        let object=this.state;//  encola la image abajo
        
        let keyw='';
        for (const key in object) {
            if(!object[key]&&key!='img_add'){
                keyw=key;
                this.setState({
                    [key]: e.target.src
                });
                break;
            }
        }
        this.fillArray(e,keyw);
        
        // this.checkAllTime();
        
    }

}

export default IndexCoverPage;
