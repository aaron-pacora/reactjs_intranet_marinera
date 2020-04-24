import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import AppRoutes from './routes';

import './sass/layouts/general/layout.sass';

render(
    <Router>
        <AppRoutes/>
    </Router>,
    document.getElementById('app')
)