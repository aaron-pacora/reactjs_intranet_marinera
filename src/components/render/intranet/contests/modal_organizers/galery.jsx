import React, { Component } from 'react';

import Organizer from './galery/organizer';
import Utils from '../../../../../utils/utils';
//import '../../../../sass/modules/intranet/news/list.sass';

class Galery extends Component {
    constructor(){
        super();
        this.state={
            data: [
                // {
                //     id: "6ed85019-c137-47c6-bb1e-d601b12feec1",
                //     src : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ataewFjEZRPEBIf3kmjtDpSvuzRO0i9p449OUCgbWxW2-4vS",
                //     link : "este el el link de la imagen"
                // },
            ]
        }
        this.utils = new Utils();
        this.countSelectedItem = 0;
        
    }
    fetchOrganizers(){
        this.utils.doQuery("/intranet/organizer/index")
        .then((response)=>{
            this.setState({
                data: response
            })
        })
    }
    componentDidMount(){
        this.fetchOrganizers();
    }
    componentDidUpdate(){
        // this.fetchOrganizers();
    }
    componentWillUpdate(nextProps,nextState){
        if (this.isDiferent(this.state,nextState)) {
            this.setState(nextState)
        };
    }
    isDiferent(currentState,nextState){///necesary for avoid infinite loop (state/componentUpdate)
        for (const key in currentState) {
            if (currentState.hasOwnProperty(key)
                && currentState[key]!=nextState[key])
                return true;
        }
        return false;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.update_galery == 1){
            this.fetchOrganizers();
        }
    }
    render() {
        return (
            <div className="galery" >
                {
                    this.state.data.map((element)=>{
                        return <Organizer element={element} 
                                            key={element.id}
                                            // isSelectedItem={this.isSelectedItem.bind(this)}
                                            // increaseCount={this.increaseCount.bind(this)}
                                            // decreaseCount={this.decreaseCount.bind(this)}
                                            addIdToArray         = {this.props.addIdToArray}
                                            removeIdToArray      = {this.props.removeIdToArray}
                                            getArrayIdsLength    = {this.props.getArrayIdsLength}
                                            fetchOrganizers      = {this.fetchOrganizers.bind(this)}
                                            fetchOrganizersIndex = {this.props.fetchOrganizers}/>
                    })
                }
            </div>
        );
    }
    // isSelectedItem(){
    //     if(this.countSelectedItem>0){
    //         return true;
    //     }
    //     return false
    // }
    // increaseCount(){
    //     this.countSelectedItem++;
    // }
    // decreaseCount(){
    //     this.countSelectedItem--;
    // }

}

export default Galery;