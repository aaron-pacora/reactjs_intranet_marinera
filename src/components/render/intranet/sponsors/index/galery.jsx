import React, { Component } from 'react';

import Sponsor from './galery/sponsors';
import Utils from '../../../../../utils/utils';
//import '../../../../sass/modules/intranet/news/list.sass';

class Galery extends Component {
    constructor(){
        super();
        this.utils = new Utils();
        this.state={
            data: [
                // {
                //     id: "6ed85019-c137-47c6-bb1e-d601b12feec1",
                //     src : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ataewFjEZRPEBIf3kmjtDpSvuzRO0i9p449OUCgbWxW2-4vS",
                //     link : "este el el link de la imagen"
                // },
                     
            ]
        }
        this.countSelectedItem=0;
    }
    fetchSponsors(){
        this.utils.doQuery("/intranet/sponsor/index")
        .then((response)=>{
            this.setState({
                data: response
            })
        })
    }
    componentDidMount(){
        this.fetchSponsors();
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
            this.fetchSponsors();
        }
    }
    render() {
        return (
            <div className="galery" >
                {
                    this.state.data.map((element)=>{
                        return <Sponsor element={element} 
                                            key={element.id}
                                            // isSelectedItem={this.isSelectedItem.bind(this)}
                                            // increaseCount={this.increaseCount.bind(this)}
                                            // decreaseCount={this.decreaseCount.bind(this)}
                                            addIdToArray={this.props.addIdToArray}
                                            removeIdToArray={this.props.removeIdToArray}
                                            getArrayIdsLength={this.props.getArrayIdsLength}
                                            fetchSponsors={this.fetchSponsors.bind(this)}/>
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