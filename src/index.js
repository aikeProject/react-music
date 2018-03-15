import React from 'react';
import ReactDOM from 'react-dom';
// 通用方法
import './util/rem';
// 全局样式
import './index.styl';
// 字体图标
import '@/assets/stylus/font.styl';

// import App from './component/App';
import Root from './component/Root';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
