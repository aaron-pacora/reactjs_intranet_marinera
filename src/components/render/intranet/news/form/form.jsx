import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import Utils from '../../../../../utils/utils';

import global from '../../../../../../providers/global.static.jsx';
import IconImage from '../../../../../icons/svg_image.svg';
const Compress = require('compress.js');

class FormNews extends Component {
    constructor(props) {
        super(props);
        this.st_title    = false;
        this.st_subtitle = false;
        this.st_txtarea  = false;
        this.st_file     = false;
        this.utils       = new Utils();
        this.dataForm = new FormData();

        this.id_notice    = "";

        this.onSubmit               = this.onSubmit.bind(this);
        this.changeInputTitle       = this.changeInputTitle.bind(this);
        this.changeInputSubitle     = this.changeInputSubitle.bind(this);
        this.changeInputDescription = this.changeInputDescription.bind(this);
        this.dataNotice             = this.props.dataNotice ? this.props.dataNotice : {};
        this.changeBoolean          = true;
        this.state = {
            redirect   : false,
            title      : '',
            subtitle   : '',
            description: '',
            src        : '',
            on_save    : false,
            inLoadImage: false
        };

        $(document).ready(function () {
            $('.modal').modal();
        });
    }

    onChangeData() {
        let withData = this.st_title && this.st_subtitle && this.st_txtarea && this.st_file;
        withData ? this.btn_save.classList.add("_complete") : this.btn_save.classList.remove("_complete");
    }

    keyUpStatus(evt) { 
        return !!evt.target.value.trim();
    }

    onChangeImage(pathImg){
        let img = new Image();
        let currentThis = this;
        img.onload = function () {
            var height = img.height;
            var width = img.width;
            if(height > width){
                $("img").addClass("max_height");
                $("img").removeClass("max_width");
            }else {
                $("img").removeClass("max_height");
                $("img").addClass("max_width");
            }
        };
        img.src = pathImg;
    }

    validadImage(evt) {
        const dataFile = evt.target.files[0];
        const validTypes = ['image/png', 'image/jpeg', 'image/raw', 'image/jpg'];

        let elementImg = $('img[id="tag_img"]');
        if (validTypes.indexOf(dataFile.type) !== -1) {
            this.st_file = true;
            let reader = new FileReader();
            let fnChangeImg = this.onChangeImage;
            reader.onload = function (e) {
                fnChangeImg(e.target.result);
                elementImg.attr('src', e.target.result);
            }
            reader.readAsDataURL(dataFile);
            this.div_ctn_upload.classList.add("with_file");
        } else {
            Materialize.toast('¡El archivo no es válido!', 4000);
            evt.target.value = null;
            this.st_file = false;
            this.div_ctn_upload.classList.remove("with_file");
            elementImg.attr('src', "");
        }
    }

    onSubmit(e){
        e.preventDefault();
        if (this.state.on_save != true){
            if (this.st_title && this.st_subtitle && this.st_txtarea && this.st_file){
                this.setState({
                    on_save: true
                });
                let fileImg = $("input[type=file]")[0].files[0];
                if (fileImg !== undefined){
                    const compress = new Compress();
                    const files = [fileImg];

                    compress.compress(files, {
                        size: 4, // the max size in MB, defaults to 2MB
                        quality: .50, // the quality of the image, max is 1,
                        maxWidth: 1920, // the max width of the output image, defaults to 1920px
                        maxHeight: 1920, // the max height of the output image, defaults to 1920px
                        resize: true, // defaults to true, set false if you do not want to resize the image width and height
                    }).then((data) => {
                        const img1      = data[0];
                        const base64str = img1.data;
                        const imgExt    = img1.ext
                        const file      = Compress.convertBase64ToFile(base64str, imgExt)
                        this.dataForm.append('title'       , this.inp_title.value);
                        this.dataForm.append('subtitle'    , this.inp_subtitle.value);
                        this.dataForm.append('description' , this.txtarea.value);
                        this.dataForm.append('img_file'    , file);
                        this.utils.doQuery("/intranet/noticias/guardar_noticia", this.dataForm)
                        .then((response)=>{
                            if (response){
                                this.setState({ redirect: true });
                            }else{
                                this.setState({
                                    on_save: false
                                });
                            }
                        });
                    });
                }else{
                    this.dataForm.append('title', this.inp_title.value);
                    this.dataForm.append('subtitle', this.inp_subtitle.value);
                    this.dataForm.append('description', this.txtarea.value);
                    this.dataForm.append('img_file', this.inp_file_img.files[0]);
                    this.utils.doQuery("/intranet/noticias/guardar_noticia", this.dataForm)
                    .then((response) => {
                        if (response) {
                            this.setState({ redirect: true });
                        } else {
                            this.setState({
                                on_save: false
                            });
                        }
                    });
                }
            }
        }
    }

    onClickCancel(){
        this.setState({redirect: true});
    }

    changeInputTitle(event){
        this.setState({ title: event.target.value });
    }
    changeInputSubitle(event){
        this.setState({ subtitle: event.target.value });
    }
    changeInputDescription(event){
        this.setState({ description: event.target.value });
    }

    componentWillReceiveProps(nextProps){
        let dataNotice = nextProps.dataNotice;
        this.id_notice = dataNotice.id;
        this.setState({
            src: dataNotice.src,
            title: dataNotice.title,
            subtitle: dataNotice.subtitle,
            description: dataNotice.description,
        });
        this.dataForm.append("id",this.id_notice);
        this.dataForm.append("src",dataNotice.src);
        this.dataForm.append("status",dataNotice.status);
        this.st_title = this.st_subtitle = this.st_txtarea = this.st_file = true;
        this.div_ctn_upload.classList.add("with_file");
        this.btn_save.classList.add("_complete");
        this.onChangeImage(global.URBBASERESOURCE + "/notices/" + this.clearIdUUID(this.id_notice) + dataNotice.src);
    }

    clearIdUUID(id){
        id = id.replace(/-/g,"");
        return id;
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/noticias' />;
        }
        return (
            <form className="form" onSubmit={this.onSubmit} encType="multipart/form-data" >
                <div className="content_data">
                    <div className="content_inps">
                        <div className="input-field">
                            <input  name="title"
                                    type="text"
                                    value={this.state.title}
                                    onChange={this.changeInputTitle}
                                    id="title_news"
                                    onKeyUp={(e) => { this.st_title = this.keyUpStatus(e); this.onChangeData();}}
                                    ref={(input) => { this.inp_title = input; }} />
                            <label htmlFor="title_news">Título</label>
                        </div>
                        <div className="input-field">
                            <input  name="subtitle"
                                    type="text"
                                    value={this.state.subtitle}
                                    onChange={this.changeInputSubitle}
                                    id="subtitle_news"
                                    onKeyUp={(e) => { this.st_subtitle = this.keyUpStatus(e); this.onChangeData();}}
                                    ref={(input) => { this.inp_subtitle = input; }} />
                            <label htmlFor="subtitle_news">Subtítulo</label>
                        </div>
                        <div className="input-field">
                            <textarea   name="description"
                                        className="materialize-textarea"
                                        type="text"
                                        value={this.state.description}
                                        onChange={this.changeInputDescription}
                                        id="description_news"
                                        onKeyUp={(e) => { this.st_txtarea = this.keyUpStatus(e); this.onChangeData();}}
                                        ref={(input) => { this.txtarea = input; }}></textarea>
                            <label htmlFor="description_news">Descripción</label>
                        </div>
                    </div>
                    <div className="content_upload_img">
                        <div className="button_upload_design" ref={(div) => { this.div_ctn_upload = div; }}>
                            <div className={"picture_box z-depth-5 " + (this.state.inLoadImage ? "" :"in_loading")}>
                                <div className="icon_image_box">
                                    <IconImage />
                                </div>
                                <div className="image_upload">
                                    <img id="tag_img"
                                        src={!!this.state.src ? global.URBBASERESOURCE + "/notices/" + this.clearIdUUID(this.id_notice) + this.state.src+"?2018" : ''}
                                        ref={(img) => {
                                            if (!img) { return; }
                                            img.onload = () => {
                                                if (img.complete) {
                                                    this.setState({ inLoadImage: true });
                                                }
                                            };
                                            this.tag_img = img;
                                        }} />
                                    <div className="preloader-wrapper small active">
                                        <div className="spinner-layer spinner-green-only">
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
                            <div className="file-field input-field">
                                <div className="btn_img waves-effect waves-light">
                                    <span className="">Añadir Imagen</span>
                                    <input name="img_notice"
                                        type="file"
                                        accept="image/*"
                                        id="img_notice"
                                        onChange={(e) => { if (this.state.on_save != true) {this.validadImage(e); this.onChangeData();} }}
                                        ref={(input) => { this.inp_file_img = input; }} type="file" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="message_aditional"><span>- La fecha de creación de la noticia se tomará como fecha de publicación.</span></div>
                {
                    (()=>{
                        if(this.state.on_save){
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
                            return <div className="content_buttons">
                                <button className="button_design _save waves-effect waves-light" ref={(btn) => { this.btn_save = btn; }}>Guardar</button>
                                <button className="button_design _cancel waves-effect waves-light modal-trigger" href="#popup_cancel">Cancelar</button>
                            </div>;
                        }
                    })()
                }
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
            </form>
        );
    }
}

export default FormNews;
