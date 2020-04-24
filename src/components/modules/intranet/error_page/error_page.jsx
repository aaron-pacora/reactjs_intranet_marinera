import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

class errorPage extends Component {
    render() {
        return (
            <Redirect to={"/"}/>
        );
    }
}

export default errorPage;