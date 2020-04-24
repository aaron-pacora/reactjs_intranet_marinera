import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import Home from './components/modules/home/home'
import Information from './components/modules/intranet/information/form';
import CoverPage from './components/modules/intranet/cover_page/index';
import News from './components/modules/intranet/news/list';
import FormNews from './components/modules/intranet/news/form';
import ChangePassword from './components/modules/intranet/change_password/change_password';
import ErrorPage from './components/modules/intranet/error_page/error_page';
import Contacts from './components/modules/intranet/contacts/index';
import Contacts_Send_Email from './components/modules/intranet/contacts/form_send_mail';
import Contests from './components/modules/intranet/contests/list';
import Contests_Form from './components/modules/intranet/contests/form';
import Sponsors from './components/modules/intranet/sponsors/index';
import Agreement from './components/modules/intranet/agreement';

const AppRoutes = () => {
    let currentCookie = Cookies.get('_svaf');
    if (currentCookie !== undefined ){
        if ((typeof currentCookie) === "string"){
            return (
                <Switch>
                    <Route exact path="/" component={Home} />
        
                    <Route exact path="/portada" component={CoverPage}/>
        
                    <Route exact path="/noticias" component={News} />
                    <Route exact path="/noticias/nuevo" component={FormNews} />
                    <Route exact path="/noticias/:id" component={FormNews} />
        
                    <Route exact path="/informacion" component={Information} />
        
                    <Route exact path="/cambiar_contraseña" component={ChangePassword} />
        
                    <Route exact path="/contactos" component={Contacts} />
                    <Route exact path="/contactos/:id" component={Contacts_Send_Email} />
        
                    <Route exact path="/concursos" component={Contests} />
                    <Route exact path="/concursos/nuevo" component={Contests_Form} />
                    <Route exact path="/concursos/:id" component={Contests_Form} />
        
                    <Route exact path="/auspiciadores" component={Sponsors} />
                    <Route exact path="/convenios" component={Agreement} />
        
                    <Route component={ErrorPage} />
        
                </Switch>
            );
        }
        return (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route component={ErrorPage} />
            </Switch>
        );
    }else{
        return (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route component={ErrorPage} />
            </Switch>
        );
    }
}

export default AppRoutes;