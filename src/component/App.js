import React, {Component} from 'react';
import {BrowserRouter as Router, Route, NavLink, Switch, Redirect} from 'react-router-dom';
import './App.styl';
import logo from '../assets/imgs/logo.png';
import Recommend from './Recommend/Recommend';
import Ranking from './Ranking/Ranking';
import Search from './search/Search';
// 音乐播放组件
import MusicPlayer from '../component/play/MusicPlayer/MusicPlayer';

class App extends Component {
    componentDidMount() {

    }
    render() {
        return (
            <Router>
                <div className="App">
                    <div className={'header'}>
                        <img src={logo} alt="music" className={'logo'}/>
                    </div>
                    <div className={'tab-bar'}>
                        <div className={'tab-item'}>
                            <NavLink to={'/recommend'} className={'nav-link'}>
                                <span>推荐</span>
                            </NavLink>
                        </div>
                        <div className={'tab-item'} >
                            <NavLink to={'/ranking'} className={'nav-link'}>
                                <span>排行榜</span>
                            </NavLink>
                        </div>
                        <div className={'tab-item'}>
                            <NavLink to={'/search'} className={'nav-link'}>
                                <span>搜索</span>
                            </NavLink>
                        </div>
                    </div>
                    <div className={'music-view'}>
                        <Switch>
                            <Route path={'/recommend'} component={Recommend}/>
                            <Route path={'/ranking'} component={Ranking}/>
                            <Route path={'/search'} component={Search}/>
                            <Redirect from={'/'} to={'/recommend'}/>
                            <Route component={Recommend}/>
                        </Switch>
                    </div>
                    <MusicPlayer />
                </div>
            </Router>
        );
    }
}

export default App;
