import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router-dom';
import './style.styl';
import {getSearchList, getSearch} from '@/api/search';
import {CODE_SUCCESS} from '@/api/config';
import {createSong} from '@/model/song';
import {createAlbumBySearch} from '@/model/album';
import {createSingerSearch} from '@/model/singer';
import {getSongVKey} from '@/api/song';
import {getTransitionEndName} from "@/util/event";
import Loading from '@/common/loading/Loading';
import Scroll from '@/common/scroll/Scroll';

import Album from '@/containers/Album';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshScroll: false,
            hotKeys: [], // 热歌
            album: {}, // 专辑
            singer: {}, // 歌手
            songs: [],
            w: '', // 搜索的关键字
        }
    }

    componentDidMount() {
        // 请求热歌
        getSearchList().then((res) => {
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    this.setState({
                        hotKeys: res.data.hotkey
                    })
                }
            }
        });
        this.initMusicIco();
    }

    // 控制输入框内容
    handleSearch = (e) => {
        this.setState({
            w: e.currentTarget.value,
            singer: {},
            album: {},
            songs: [],
        })
    };
    // 搜索
    search = (w) => {
        this.setState({
            w, loading: true,
        });
        // 调用搜索接口
        getSearch(w).then((res) => {
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    const {song, zhida} = res.data;
                    let album = {};
                    const songs = [];
                    let singer = {};
                    // 搜索到的歌曲
                    song.list.forEach((song) => {
                        if (song.pay.payplay === 1) {
                            return;
                        }
                        songs.push(createSong(song));
                    });
                    // 搜索类型
                    switch (zhida.type) {
                        case 0:
                            break; // 歌曲类型
                        case 2: // 歌手
                            singer = createSingerSearch(zhida);
                            singer.songnum = zhida.songnum; // 歌曲数量
                            singer.albumnum = zhida.albumnum; // 专辑数量
                            break;
                        case 3: // 专辑
                            album = createAlbumBySearch(zhida);
                            break;
                        default:
                            break;
                    }
                    this.setState({
                        album,
                        songs,
                        singer,
                        loading: false,
                    }, () => {
                        this.setState({refreshScroll: true,});
                    })
                }
            }
        });
    };
    // 调用搜索方法
    getSearch = (w) => {
        return () => {
            this.search(w)
        }
    };
    // 取消
    cancel = () => {
        this.setState({
            w: '',
            singer: {},
            album: {},
            songs: [],
        })
    };
    // 回车
    enter = (e) => {
        // 回车
        if (e.keyCode === 13) {
            this.search(this.state.w);
        }
    };
    // 详情展示分类
    handleToInfo = (data, type) => {
        const {changeCurrentSong, setSongs} = this.props;
        return (e) => {
            switch (type) {
                case 'song':
                    this.startMusicIcoAnimation(e.nativeEvent);
                    this.getSongUrl(data, data.mId);
                    changeCurrentSong(data);
                    setSongs([data]);
                    break;
                case 'album':
                    this.props.history.push({
                        pathname: `${this.props.match.url}/album/${data}`,
                    });
                    break;
                case 'singer':
                    // 暂时没有歌手详情
                    break;
                default:
                    break;
            }
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
        const {hotKeys, singer, album, songs} = this.state;
        return (
            <div className={'search-music'}>
                <div className={'search-wrapper'}>
                    <div className={'search-content'}>
                        <i className={'icon-search'}></i>
                        <input className={'search-input'} type={'text'} placeholder={'请输入歌曲名，专辑'} value={this.state.w}
                               onChange={this.handleSearch} onKeyDown={this.enter}/>
                    </div>
                    <div className={'search-btn'} style={{display: this.state.w ? 'block' : 'none'}}
                         onClick={this.cancel}>取消
                    </div>
                </div>
                <div className={'music-hot'} style={{display: this.state.w ? 'none' : 'block'}}>
                    <div className={'title'}>热门搜索</div>
                    <div className={'hot-list'}>
                        {
                            hotKeys.map((hot, index) => {
                                return (
                                    <div className={'hot-item'} key={index}
                                         onClick={this.getSearch(hot.k)}>{hot.k}</div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={'search-result'} style={{display: this.state.w ? 'block' : 'none'}}>
                    <Scroll refresh={this.state.refreshScroll}>
                        <div className={'album-wrapper clear-float'} style={{display: album.id ? 'block' : 'none'}}
                             onClick={this.handleToInfo(album.mId, 'album')}>
                            <div className={'left'}>
                                <img src={album.img} alt={album.name}/>
                            </div>
                            <div className={'right'}>
                                <div className={'name beyond-the-hidden'}>{album.name}</div>
                                <div className={'singer beyond-the-hidden'}>{album.singer}</div>
                            </div>
                        </div>
                        <div className={'singer-wrapper clear-float'} style={{display: singer.id ? 'block' : 'none'}}
                             onClick={this.handleToInfo(singer, 'singer')}>
                            <div className={'left'}>
                                <img src={singer.img} alt={singer.name}/>
                            </div>
                            <div className={'right'}>
                                <div className={'name beyond-the-hidden'}>{singer.name}</div>
                                <div className={'info beyond-the-hidden'}>单曲{singer.songnum} 专辑{singer.albumnum}</div>
                            </div>
                        </div>
                        {
                            songs.map((song) => {
                                return (
                                    <div className={'song-wrapper clear-float'} key={song.id}
                                         onClick={this.handleToInfo(song, 'song')}>
                                        <div className={'left'}>
                                            <i className={'icon-fe-music'}></i>
                                        </div>
                                        <div className={'right'}>
                                            <div className={'name beyond-the-hidden'}>{song.name}</div>
                                            <div className={'singer beyond-the-hidden'}>{song.singer}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Scroll>
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
                <Route path={`${this.props.match.url}/album/:id`} component={Album}/>
                <Loading loading={this.state.loading}/>
            </div>
        )
    }
}

export default Search;
