/**
 * User: aike
 * Date: 2018/3/14 0014
 * Time: 19:27
 *
 */
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from '@/redux/store';
import App from './App';

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        )
    }
}

export default Root;

