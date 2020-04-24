import React,{Component} from 'react';

import IconImage from '../../../../../icons/svg_image.svg'
import global from '../../../../../../providers/global.static.jsx';

import Utils from '../../../../../utils/utils';

class form extends Component {
  constructor() {
    super();
    this.state={
      image_upload: '',
      information : '',
      short       : '',
      cell_phone1 : '',
      cell_phone2 : '',
      adress      : ''
    }
    this.utils = new Utils();
    this.prev         = '';
    this.id           = '';
    this.redirect     = false;
    this.enabledFetch = false;
    this.inLoadImage  = false;
    this.dataForm     = new FormData();
    
    this.changeValue  = this.changeValue.bind(this);
    this.checkAllTime = this.checkAllTime.bind(this);
    this.showImage    = this.showImage.bind(this);
    
    this.onClickCancel   = this.onClickCancel.bind(this);
    this.preventSends    = this.preventSends.bind(this);
    this.countCharacters = this.countCharacters.bind(this);
    this.fetchInit()
  }
  fetchInit(){
    this.utils.doQuery("/intranet/informacion")
    .then((rpta) => {
          if(rpta){
            let data=JSON.parse(rpta.dataConfiguration)
            this.id= data.id;
            this.setState({
              image_upload : global.URBBASERESOURCE+"/logo/logo"+data.src_logo,
              information  : data.about_us,
              short        : data.short_description,
              cell_phone1  : data.first_number,
              cell_phone2  : data.second_number,
              adress       : data.address
            });
            this.autoFocusInp();
          }
    });
  }
  componentDidMount(){
    $(document).ready(function(){
      // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
      $('.modal').modal();
    });
    if(this.state.image_upload){
      //cambiar fondo
      $(".content_upload_img").css("background","#9E9E95");
    }
    
  }
  
  render(){
    if(this.state.image_upload){
      //cambiar fondo
      $(".content_upload_img").css("background","#9E9E95");
    }
    if (this.redirect) {
      location.reload();
      // return <Redirect to='/informacion' />;
    }
    return (
      <form  encType="multipart/form-data" onSubmit={this.onSubmit.bind(this)}  >
        <div className="content_control">
          <div className="content_image">
            <div className={"content_upload_img " + (this.state.inLoadImage ? "" :"in_loading")}>
                <div className="icon">
                  <IconImage/>
                </div>
                {!!this.state.image_upload?
                <img onLoad={this.resize} src={this.state.image_upload} ref={(img) => {
                  if (!img) { return; }
                  img.onload = () => {
                    if (img.complete) {
                      this.setState({ inLoadImage: true });
                    }
                  };
                  this.tag_img = img;
                }}/> : ''}
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
              <label className="content_input_file waves-effect waves-light ">
                Añadir Logo
                <input type="file" name="image_upload" accept="image/*" onChange={(e)=>{e.target.value!=""?this.changeValue(e):'';}}/>
              </label>
          </div>
          {
            (() => {
              if (this.state.on_save) {
                return <div className="content_preloader">
                  <div className="preloader-wrapper medium active">
                    <div className="spinner-layer">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div><div className="gap-patch">
                        <div className="circle"></div>
                      </div><div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>
                </div>;
              } else {
                return <div className="content_buttons">
                  <button name="Guardar" className="waves-effect waves-light  button_design _save">Guardar</button>
                  <button name="Cancelar" href="#popup_cancel" className="waves-effect waves-light button_design _cancel modal-trigger" onClick={this.preventSends}>Cancelar</button>
                </div>
              }
            })()
          }
          <div id="popup_cancel" className="modal" >
              <div className="modal-content">
                  <h4>¿Desea cancelar?</h4>
                  <div className="line_modal"></div>
                  <span>Los datos agregados se perderán.</span>
              </div>
              <div className="modal-footer">
                  <div className="modal-action modal-close waves-effect waves-green btn" onClick={() => { this.onClickCancel()}}>Sí</div>
                  <div className="modal-action modal-close waves-effect waves-green btn" >No</div>
              </div>
          </div>
        </div>
        <h2>Información sobre nosotros</h2>
        <div className="content_text">
          <div className="content_textArea input-field">
            <textarea id="description" className="materialize-textarea" name="information" maxLength="600" value={this.state.information} onChange={(e)=>{this.changeValue(e);}} onKeyUp={(e)=>{this.changeValue(e)}}>
            </textarea>
            
            <label htmlFor="description">¿Quienes somos?</label>
            
          </div>
          <div className="content_inputs">
            <div className="content_cell_phones"> 
              <div className="input-field content_cell">
                <input id="cell_1" type="text" name="cell_phone1" maxLength="9" value={this.state.cell_phone1} onChange={(e)=>{this.changeValue(e); }} onKeyUp={this.changeValue}/>
                <label htmlFor="cell_1">Celular 1</label>
              </div>
              <div className="input-field content_cell">
                <input id="cell_2" type="text" name="cell_phone2" maxLength="9" value={this.state.cell_phone2} onChange={(e)=>{this.changeValue(e); }} onKeyUp={this.changeValue}/>
                <label htmlFor="cell_2">Celular 2</label>
              </div>
            </div>
            <div className="input-field" > 
              <input id="adress" type="text" name="adress"  value={this.state.adress} onChange={(e)=>{this.changeValue(e); }} onKeyUp={this.changeValue}/>
              <label htmlFor="adress">Dirección</label>
            </div>
            <div className="content_short_desc input-field" >
              <textarea id="short_desc" className="materialize-textarea" name="short"  cols="30" rows="10" maxLength="200"  value={this.state.short} onChange={(e)=>{this.changeValue(e);this.countCharacters(e,200);}} onKeyUp={this.changeValue}></textarea>
              {/* <div className="count">0/200</div> */}
              <label htmlFor="short_dec" >Descripción corta</label>
              
            </div>
            
          </div>
          
        </div>
      </form>
    )
  }
  
  autoFocusInp(){
    let inputs = $("input");
    for (let i = 0; i < inputs.length; i++) {
      let element = $(inputs[i]);
      element.focus();
      element.blur();
    }
    let txtArea = $("textarea");
    for (let i = 0; i < txtArea.length; i++) {
      let element = $(txtArea[i]);
      element.focus();
      element.blur();
    }
  }
  
  changeValue(e){// cambiar estado de los inputs
    let key=e.target.name;
    let val=e.target.value+"";
    let key_code= val.substring(val.length-1);
    let array=['0','1','2','3','4','5','6','7','8','9'];
    if((key=="cell_phone1"||key=="cell_phone2")&&((-1==array.indexOf(key_code))||(val.length>9))){
      val=val.substring(0,val.length-1)
    }
    this.setState({
      [key]: key!='image_upload'?val:this.showImage(e)
    })
    //mejor aca por que en el change puede no funcione :'c
    this.prev=$("input[type=file]")[0].files[0];
    this.checkAllTime()
  }
  
  showImage(e){
    // cargar imagen en vista :')
    let input=e.target;
    let aux =this;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            aux.setState({
              image_upload: e.target.result
            });
            aux.checkAllTime();
        }
        reader.readAsDataURL(input.files[0]);
    }
  }
  
  checkAllTime(){
    let aux=this;
    // si la img contiene imagen, que se oculte el svg
    let inpFile=$("input[type=file]").val();
    if (!!inpFile.length) {
      $("content_upload_img svg").css("display","none");
    }else{
      $("content_upload_img svg").css("display","block")
    }
    let objectInputs=Object.values(aux.state)
    let count=0
    for (let val of objectInputs) {
        if(val!=''){
          count++
        }
    }
    if(count==objectInputs.length){
        aux.enabledSave()
    } else {
        aux.disableSave()
    }

     
  }
  enabledSave(){
    this.enabledFetch = true;
    $("button[name='Guardar']").addClass("_complete");
  }
  disableSave(){
    $("button[name='Guardar']").removeClass("_complete");
  }

  onClickCancel(){
    this.redirect=true
    setTimeout(() => {
      this.setState({
      })
    }, 1000);
    
  }

  onSubmit(e ){
    e.preventDefault()
    let array = Object.values(this.state);
    let count = 0;
    for (const item of array) {
      item != '' ? count++ : '';
    }//verificar
    if (count == array.length && this.enabledFetch){
      this.dataForm.append('about_us', this.state.information);
      this.dataForm.append('short_description'    , this.state.short);
      this.dataForm.append('first_number' , this.state.cell_phone1);
      this.dataForm.append('second_number'    , this.state.cell_phone2);
      this.dataForm.append('address'    , this.state.adress);
      let file_img = $("input[type=file]")[0].value=="" ? this.prev : $('input[type=file]')[0].files[0];//verificar
      
      file_img!=undefined?this.dataForm.append('img_file' , file_img):"";
      
      this.id!=''?this.dataForm.append('id' , this.id):'';

      this.setState({ on_save: true});
      this.utils.doQuery("/intranet/configuracion/guardar_configuracion", this.dataForm)
      .then((response)=>{
        this.setState({ on_save: false });
          if (response){
            //toast
            this.redirect=true;
            this.setState({});
          }else{
            //toast
            //mostrar mensaje
          }
      })
      
    }
  }
  preventSends(e){
    e.preventDefault()
  }
  countCharacters(e,num){
    let len=$('.count').val().length;
    $(".count").html(len+"/"+num) 
  
  }
  resize(){
    let image=$("img");
      let width=image.width()
      let height=image.height()
      // alert("width :"+width+" "+"height :"+height)
      width>height?$(image).css({"width":"100%","height":"auto"}):$(image).css({"width":"auto","height":"100%"});
  }
}
export default form
