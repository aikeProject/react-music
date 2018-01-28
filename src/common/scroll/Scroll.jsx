import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import bScroll from 'better-scroll';
import './style.styl';

class Scroll extends Component {
    // 组件更新后执行
    componentDidUpdate() {
        //组件更新后，如果实例化了better-scroll并且需要刷新调用refresh()函数
        if (this.bScroll && this.props.refresh === true) {
            this.bScroll.refresh();
        }
    }
    componentDidMount() {
        // 初始化滑屏插件
        // 找到dom元素
        // react 通过绑定在元素上的ref属性获取dom
        this.scrollView = ReactDom.findDOMNode(this.refs.scrollView);
        if (!this.bScroll) {
            this.bScroll = new bScroll(this.scrollView, {
                probeType: 3,
                click: this.props.click
            });
            if (this.props.onScroll) {
                this.bScroll.on("scroll", (scroll) => {
                    this.props.onScroll(scroll);
                });
            }
        }
    }
    componentWillUnmount() {
        this.bScroll.off("scroll");
        this.bScroll = null;
    }
    refresh() {
        if (this.bScroll) {
            this.bScroll.refresh();
        }
    }
    render() {
        return (
            <div className={'scroll'} ref={'scrollView'}>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
// 默认值
Scroll.defaultProps = {
    click: true,
    refresh: false,
    onScroll: null
};
Scroll.propTypes = {
    //是否启用点击
    click: PropTypes.bool,
    //是否刷新
    refresh: PropTypes.bool,
    onScroll: PropTypes.func
};
export default Scroll;