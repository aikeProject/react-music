import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './style.styl';

class Progress extends Component {
    componentDidUpdate() {
        // 组件更新后重新获取宽度
        const progressBarDOM = ReactDOM.findDOMNode(this.refs.progressBar);
        const progressButtonDOM = ReactDOM.findDOMNode(this.refs.progressButton);
        this.progressBarWidth = progressBarDOM.offsetWidth;
        this.progressBtnWidth = progressButtonDOM.offsetWidth;
    }

    componentDidMount() {
        const {disableButton, disableDrag, onDragStart, onDrag, onDragEnd} = this.props;
        const progressBarDOM = ReactDOM.findDOMNode(this.refs.progressBar);
        const progressDOM = ReactDOM.findDOMNode(this.refs.progress);
        const progressButtonDOM = ReactDOM.findDOMNode(this.refs.progressButton);
        this.progressBarWidth = progressBarDOM.offsetWidth;
        // 按钮的大小
        this.progressBtnWidth = progressButtonDOM.offsetWidth * 3;
        console.log(progressButtonDOM.offsetWidth);
        // this.progressBtnWidth = getComputedStyle(progressButtonDOM, 'width');
        // console.log(getComputedStyle(progressButtonDOM)['width']);
        console.log(this.progressBtnWidth);
        /*          拖拽功能实现           */
        if (disableButton !== true && disableDrag !== true) {
            // 触摸开始的位置
            let downX = 0;
            // 按钮left
            let buttonLeft = 0;

            // 点击进度条
            progressBarDOM.parentNode.addEventListener('touchstart', (e) => {
                let touch = e.touches[0];
                downX = touch.clientX;
                //获取进度条当前位置
                const progressLeft = progressBarDOM.offsetLeft;
                // 设置按钮的left值
                progressButtonDOM.style.left = (downX - progressLeft) + 'px';
                // 设置进度width
                progressDOM.style.width = (downX - progressLeft) / this.progressBarWidth * 100 + '%';
            });

            progressButtonDOM.addEventListener('touchstart', (e) => {
                let touch = e.touches[0];
                downX = touch.clientX;
                buttonLeft = parseInt(touch.target.style.left, 10);
                onDragStart && onDragStart();
            });
            progressButtonDOM.addEventListener('touchmove', (e) => {
                e.preventDefault();
                let touch = e.touches[0];
                // 手指在屏幕上移动的距离
                let diffx = touch.clientX - downX;
                // 按钮的left值
                let btnLeft = buttonLeft + diffx - this.progressBtnWidth;
                if (btnLeft >= progressBarDOM.offsetWidth - this.progressBtnWidth) {
                    btnLeft = progressBarDOM.offsetWidth - this.progressBtnWidth;
                } else if (btnLeft < 0) {
                    btnLeft = 0;
                }
                // 设置按钮的left值
                touch.target.style.left = (btnLeft) + 'px';
                // 设置进度width
                progressDOM.style.width = (btnLeft) / (this.progressBarWidth - this.progressBtnWidth) * 100 + '%';
                onDrag && onDrag();
            });
            progressButtonDOM.addEventListener('touchend', (e) => {
                onDragEnd && onDragStart();
            })
        }
        /*              END              */
    }

    render() {
        let {progress, disableButton} = this.props;
        if (progress) {
            progress = 0;
        }
        // left值
        let progressButtonOffsetLeft = 0;
        if (this.progressBarWidth) {
            progressButtonOffsetLeft = progress * this.progressBarWidth;
        }

        return (
            <div style={{width: '100%'}}>
                <div className={'progress-bar'} ref={'progressBar'}>
                    <div className={'progress-load'}></div>
                    <div className={'progress'} style={{width: `${progress * 100}%`}} ref={'progress'}></div>
                    {
                        disableButton === true ? '' :
                            <div className={'progress-button'} style={{left: progressButtonOffsetLeft + 'px'}}
                                 ref={'progressButton'}></div>
                    }
                </div>
            </div>
        )
    }
}

Progress.propTypes = {
    progress: PropTypes.number.isRequired, // 进度 必须
    disableButton: PropTypes.bool, // 是否禁用按钮
    disableDrag: PropTypes.bool, // 是否禁用拖拽
    onDragStart: PropTypes.func, // 开始
    onDrag: PropTypes.func, // 拖拽中
    onDragEnd: PropTypes.func // 结束
};

export default Progress;
