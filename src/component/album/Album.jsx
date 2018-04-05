import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './style.styl';
// header组件
import Header from '@/common/header/Header';
import Loading from '@/common/loading/Loading';
import Scroll from '@/common/scroll/Scroll';

// 专辑详情数据
import {getAlbumInfo} from '@/api/recommendApi';
import {CODE_SUCCESS} from '@/api/config';
import * as AlbumModel from '@/model/album';
import * as SongModel from '@/model/song';

// 歌曲接口
import {getSongVKey} from '@/api/song';

// 动画组件
import {CSSTransition} from 'react-transition-group';

import {getTransitionEndName} from "@/util/event";

class Album extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            album: [],
            songs: [],
            refreshScroll: false,
            show: false // 控制动画
        }
    }

    componentDidMount() {
        const {match} = this.props;
        const albumBgDom = ReactDOM.findDOMNode(this.refs.albumBg);
        const albumContentDom = ReactDOM.findDOMNode(this.refs.albumContent);
        // console.log(albumBgDom.offsetHeight);
        albumContentDom.style.top = albumBgDom.offsetHeight + 'px';
        this.initMusicIco();
        // 实现动画
        this.setState({
            show: true,
        });

        // 获取专辑详情
        const albumId = match.params.id;
        getAlbumInfo(albumId).then((res) => {
            // console.log(res);
            if (res.code === CODE_SUCCESS) {
                let album = AlbumModel.createAlbumByDetail(res.data);
                album.desc = res.data.desc;
                const songLlist = res.data.list;
                // console.log(songLlist);
                const songs = [];
                songLlist.forEach(item => {
                    // 根据给定数据模型，将data中的歌曲列表，提取出需要展示的数据
                    const song = SongModel.createSong(item);
                    // 获取歌曲播放地址
                    this.getSongUrl(song, item.songmid);
                    songs.push(song);
                    // console.log(song)
                });
                // console.log(songs);
                this.setState({
                    album,
                    songs,
                    loading: false
                }, () => {
                    // 刷新scroll
                    this.setState({
                        refreshScroll: true
                    })
                })
            }
        })
    }

    // 滚动设置
    scroll = (position) => {
        // 监听 scroll 组件滚动事件
        const {y} = position;
        const albumBgDom = ReactDOM.findDOMNode(this.refs.albumBg);
        const albumBgFixed = ReactDOM.findDOMNode(this.refs.albumBgFixed);
        // const playButton = ReactDOM.findDOMNode(this.refs.playButton);
        if (y < 0) { // 向上滚动
            // 当向上滑动的距离超过，专辑封面的高度，隐藏大图，显示header区域的小图
            if (Math.abs(y) + 55 > albumBgDom.offsetHeight) {
                albumBgFixed.style.display = 'block';
            } else {
                albumBgFixed.style.display = 'none';
            }
        } else {
            // 向下滚动
            const scale = 1 + y * 0.01 > 2 ? 2 : 1 + y * 0.01;
            const transform = `scale(${scale})`;
            albumBgDom.style['webkitTransform'] = transform;
            albumBgDom.style['transform'] = transform;
            // playButton.style['bottom'] = 20 - y + 'px';
        }
    };

    // 获取歌曲的vKey, 然后拼接出歌曲文件地址
    getSongUrl(song, mId) {
        getSongVKey(mId).then((res) => {
            if (res && res.code === CODE_SUCCESS) {
                const item = res.data.items[0];
                // 播放地址
                // filename 歌曲文件
                // vkey 歌曲的key值
                song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`;
            }
        })
    }

    // 点击退出时动画
    handleExit() {
        this.setState({
            show: false
        })
    }

    /*              歌曲播放设置             */

    // 选择歌曲
    selectSong(song) {
        const {changeCurrentSong, setMusicSongs} = this.props;
        return (e) => {
            setMusicSongs([song]);
            changeCurrentSong(song);
            // showMusicPlayer(true);
            this.startMusicIcoAnimation(e.nativeEvent);
        }
    }

    // 播放全部歌曲
    playAll = (e) => {
        // console.log(e);
        const {changeCurrentSong, showMusicPlayer, setMusicSongs} = this.props;
        if (this.state.songs.length > 0) {
            setMusicSongs(this.state.songs);
            changeCurrentSong(this.state.songs[0]);
            showMusicPlayer(true);
        }
    };
    /*                 END                 */

    // 音符动画
    initMusicIco() {  // 初始化
        this.musicIcos = [];
        this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco1));
        this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco2));
        this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco3));
        // 状态初始化
        this.musicIcos.forEach((item) => {
            item.run = false;
            let transitionEndName = getTransitionEndName(item);
            item.addEventListener(transitionEndName, function () {
                this.style.display = 'none'; // 元素隐藏
                this.style['webkitTransform'] = 'translate3d(0, 0, 0)';
                this.style['transform'] = 'translate3d(0, 0, 0)';
                this.run = false;
                let icon = this.querySelector('div');
                icon.style['webkitTransform'] = 'translate3d(0, 0, 0)';
                icon.style['transform'] = 'translate3d(0, 0, 0)';
            }, false)
        })
    }

    startMusicIcoAnimation({clientX, clientY}) {
        if (this.musicIcos.length > 0) {
            for (let i = 0; i < this.musicIcos.length; i++) {
                let item = this.musicIcos[i];
                // 选择未动画的元素开始动画
                if (item.run === false) {
                    item.style.top = clientY + 'px';
                    item.style.left = clientX + 'px';
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.run = true;
                        item.style['webkitTransform'] = 'translate3d(0, 1000px, 0)';
                        item.style['transform'] = 'translate3d(0, 1000px, 0)';
                        let icon = item.querySelector('div');
                        icon.style['webkitTransform'] = 'translate3d(-30px, 0, 0)';
                        icon.style['transform'] = 'translate3d(-30px, 0, 0)';
                    }, 10);
                    break;
                }
            }
        }
    }

    render() {
        let {album, songs} = this.state;
        let newSongs = songs.map((item) => {
            return (
                <div className={'song'} key={item.id} onClick={this.selectSong(item)}>
                    <div className={'song-name'}>{item.name}</div>
                    <div className={'song-singer'}>{item.singer}</div>
                </div>
            );
        });
        return (
            <CSSTransition in={this.state.show} timeout={300} classNames={'translate'}>
                <div className={'music-album'}>
                    <Header title={'专辑详情'} ref={'header'} handleExit={this.handleExit.bind(this)}/>
                    <div className={'album-top'}>
                        <div ref={'albumBg'} className={'album-img'} style={{backgroundImage: `url(${album.img})`}}>
                            <div className={'filter'}></div>
                        </div>
                        <div ref={'albumBgFixed'} className={'album-img fixed'}
                             style={{backgroundImage: `url(${album.img})`}}>
                            <div className={'filter'}></div>
                        </div>
                        <div ref={'playButton'} className={'play-wrapper'} onClick={this.playAll}>
                            <div className={'play-button'}>
                                <i className={'icon-play'}></i>
                                <span>播放全部</span>
                            </div>
                        </div>
                    </div>
                    <div className={'album-content'} ref={'albumContent'}>
                        <div className={'album-scroll'}>
                            <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                                <div className={'album-wrapper'}>
                                    <div className={'song-count'}>专辑共{songs.length}首</div>
                                    <div className={'song-list'}>
                                        {newSongs}
                                    </div>
                                    <div className={'album-info'}>
                                        <div className={'album-title'}>专辑介绍</div>
                                        <div className={'album-desc'}>
                                            {album.desc}
                                        </div>
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                    </div>
                    <div className="music-ico" ref="musicIco1">
                        <div className="icon-fe-music"></div>
                    </div>
                    <div className="music-ico" ref="musicIco2">
                        <div className="icon-fe-music"></div>
                    </div>
                    <div className="music-ico" ref="musicIco3">
                        <div className="icon-fe-music"></div>
                    </div>
                    <Loading title={'加载中...'} loading={this.state.loading}/>
                </div>
            </CSSTransition>
        )
    }
}

export default Album;
