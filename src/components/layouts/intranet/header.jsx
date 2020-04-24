import React, { Component } from 'react';

import IconExit from '../../../icons/svg_exit.svg';
import IconPadlock from '../../../icons/svg_padlock.svg';

import IconVS from '../../../icons/svg_menu.svg';
import IconImage from '../../../icons/svg_image.svg';
import IconConfig from '../../../icons/svg_config.svg';
import IconNews from '../../../icons/svg_news.svg';
import IconInformation from '../../../icons/svg_information.svg';
import IconSponsors from '../../../icons/svg_sponsors.svg';
import IconContests from '../../../icons/svg_contests.svg'
import IconContacts from '../../../icons/svg_contacts.svg';
import IconTreat from '../../../icons/svg_treat.svg';

import Utils from '../../../utils/utils';

class Header extends Component {
    constructor(props){
        super(props);
        this.utils = new Utils();
        $(document).ready(function () {
            $('.icon_config').dropdown({
                inDuration     : 300,
                outDuration    : 225,
                constrainWidth : false,
                hover          : false,
                gutter         : 0,
                belowOrigin    : true,
                alignment      : 'left',
                stopPropagation: false
            });
        });
    }
    logout(){
        this.utils.doQuery("/logout")
        .then((rpta) => {
            Cookies.remove('_svaf');
            window.location.href = "/";
        });
    }

    render() {
        return (
            <div className="header">
                <div className="menu_header">
                    <div className="content_items_menu">
                        <div className="icon_menu_content">
                            <div className="icon_menu menu_bar" onClick={ToggleMenu}>
                                <IconVS/>
                            </div>
                            <div className="icon_menu icon_config" data-activates='dropdown_config'>
                                <IconConfig />
                            </div>
                            <ul id='dropdown_config' className='dropdown-content'>
                                <li><a href="/cambiar_contraseña"><i className="material-icons"><IconPadlock /></i>Cambiar Contraseña</a></li>
                                <li className="divider"></li>
                                <li><a href="#" onClick={()=>{
                                    this.logout();
                                }}><i className="material-icons"><IconExit /></i>Cerrar Sesión</a></li>
                            </ul>
                        </div>
                        <div className="list_menu">
                            <div className={"item_menu " + isSelected(this.props.selected, 'cover_page')}>
                                <a href="/portada">
                                    <div className="item_icon">
                                        <IconImage />
                                    </div>
                                    <span>Portada</span>
                                </a>
                            </div>
                            <div className={"item_menu " + isSelected(this.props.selected, 'sponsors')}>
                                <a href="/auspiciadores">
                                    <div className="item_icon">
                                        <IconSponsors/>
                                    </div>
                                    <span>Auspiciadores</span>
                                </a>
                            </div>
                            <div className={"item_menu " + isSelected(this.props.selected, 'news')}>
                                <a href="/noticias">
                                    <div className="item_icon">
                                        <IconNews />
                                    </div>
                                    <span>Noticias</span>
                                </a>
                            </div>
                            <div className={"item_menu " + isSelected(this.props.selected, 'contests')}>
                                <a href="/concursos">
                                    <div className="item_icon">
                                        <IconContests />
                                    </div>
                                    <span>Concursos</span>
                                </a>
                            </div>
                            {/* <div className={"item_menu " + isSelected(this.props.selected,'phrases')}>
                                <a href="/frases">
                                    <div className="item_icon">
                                        <IconPhrases />
                                    </div>
                                    <span>Frases</span>
                                </a>
                            </div> */}
                            <div className={"item_menu " + isSelected(this.props.selected, 'contacts')}>
                                <a href="/contactos">
                                    <div className="item_icon">
                                        <IconContacts/>
                                    </div>
                                    <span>Contactos</span>
                                </a>
                            </div>
                            <div className={"item_menu " + isSelected(this.props.selected, 'information')}>
                                <a href="/informacion">
                                    <div className="item_icon">
                                        <IconInformation />
                                    </div>
                                    <span>Información</span>
                                </a>
                            </div>
                            <div className={"item_menu " + isSelected(this.props.selected, 'agreement')}>
                                <a href="/convenios">
                                    <div className="item_icon">
                                        <IconTreat />
                                    </div>
                                    <span>Convenios</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function ToggleMenu(){
    $(".header").toggleClass("open");
}

function isSelected(nameToValidate,valitator){
    return nameToValidate == valitator ? 'selected':'';
}

export default Header;