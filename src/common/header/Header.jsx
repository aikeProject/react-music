import React, {Component} from 'react';
import './style.styl';

class Header extends Component {
    // 点击返回
    handleBack() {
        const {handleExit} = this.props;
        handleExit && handleExit();
        setTimeout(()=>{
            window.history.back();
        }, 300);
    }

    render() {
        return (
            <div className={'music-header'}>
                <span className={'header-back'} onClick={this.handleBack.bind(this)}>
                    <i className={'icon-back'}></i>
                </span>
                <div className={'header-title'}>
                    {this.props.title}
                </div>
            </div>
        )
    }
}

export default Header;
