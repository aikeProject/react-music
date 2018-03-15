/**
 * User: aike
 * Date: 2018/3/14 0014
 * Time: 18:04
 *
 */
import {createStore} from 'redux';
import reducers from './reducers';

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // 使用redux插件
);

export default store;
