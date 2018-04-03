import React, {Component} from 'react';
import './style.styl';

class rankingDetail extends Component{
    render() {
        const {id} = this.props.match.params;
        return (
            <div className={'ranking-detail'}>详情{id}</div>
        )
    }
}

export default rankingDetail;
