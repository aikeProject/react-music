import React, {Component} from 'react';
import loadingImg from '@/assets/imgs/logo.svg';
import './style.styl';

class Loading extends Component {
    render() {
        const {loading, title} = this.props;
        const showOrHide = loading ? {} : {display: 'none'};
        return (
            <div className={'loading-content'} style={showOrHide}>
                <div className={'loading-img'}>
                    <img src={loadingImg} width={'60px'} height={'40px'} alt={'loading'}/>
                    <div className={'title'}>{title || '加载中...'}</div>
                </div>
            </div>
        )
    }
}

export default Loading;
