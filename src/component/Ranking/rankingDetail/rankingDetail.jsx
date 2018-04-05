import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './style.styl';
import {getRankingInfo} from '@/api/ranking';
import {createRankingByInfo} from '@/model/ranking';
import {createSong} from '@/model/song';
import {getSongVKey} from '@/api/song';
import {CODE_SUCCESS} from '@/api/config/';

// 动画组件
import {CSSTransition} from 'react-transition-group';
import {getTransitionEndName} from "@/util/event";

import Loading from '@/common/loading/Loading';
import Scroll from '@/common/scroll/Scroll';
import Header from '@/common/header/Header';

class rankingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            show: false,
            ranking: {},
            songs: [],
            refreshScroll: false
        }
    }

    componentDidMount() {
        // 获取top高度
        const rankingTopDom = ReactDOM.findDOMNode(this.refs.albumBg);
        const rankingContentDom = ReactDOM.findDOMNode(this.refs.rankingContent);
        rankingContentDom.style.top = rankingTopDom.offsetHeight + 'px';

        // 初始化音符
        this.initMusicIco();

        // 获取排行详情
        const {id} = this.props.match.params; // 排行id
        getRankingInfo(id).then((res) => {
            console.log(res);
            if (res.code === CODE_SUCCESS) {
                // 排行详情
                const ranking = createRankingByInfo(res.topinfo);
                ranking.info = res.topinfo.info;
                // 歌曲列表
                const songsList = [];
                res.songlist.forEach((item) => {
                    if (item.data.pay.payplay === 1) {
                        return;
                    }
                    ;
                    const song = createSong(item.data);
                    // 获取歌曲key
                    this.getSongUrl(song, item.data.songmid);
                    songsList.push(song);
                });

                this.setState({
                    ranking,
                    songs: songsList,
                    loading: false,
                }, () => {
                    this.setState({
                        refreshScroll: true,
                        show: true
                    })
                })
            }
        });
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

    // 退出
    handleExit() {
        this.setState({
            show: false
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

    // 播放全部歌曲
    playAll = () => {
        const {showMusicPlayer, changeCurrentSong, setSongs} = this.props;
        const {songs} = this.state;
        if (songs.length > 0) {
            changeCurrentSong(songs[0]);
            setSongs(songs);
            showMusicPlayer(true);
        }
    };

    // 选择歌曲
    selectSong = (song) => {
        const {changeCurrentSong, setSongs} = this.props;
        return (e) => {
            changeCurrentSong(song);
            setSongs([song]);
            this.startMusicIcoAnimation(e);
        }
    };

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
        const {ranking, songs} = this.state;
        let newSongs = songs.map((item, index) => {
            return (
                <div className={'song'} key={item.id} onClick={this.selectSong(item)}>
                    <div className={'index'}>{index + 1}</div>
                    <div className={'content'}>
                        <div className={'song-name'}>{item.name}</div>
                        <div className={'song-singer'}>{item.singer}</div>
                    </div>
                </div>
            );
        });
        return (
            <CSSTransition in={this.state.show} timeout={300} classNames={'translate'}>
                <div className={'ranking-detail'}>
                    <Header title={ranking.title} ref={'header'} handleExit={this.handleExit.bind(this)}/>
                    <div className={'album-top'}>
                        <div ref={'albumBg'} className={'album-img'} style={{backgroundImage: `url(${ranking.img})`}}>
                            <div className={'filter'}></div>
                        </div>
                        <div ref={'albumBgFixed'} className={'album-img fixed'}
                             style={{backgroundImage: `url(${ranking.img})`}}>
                            <div className={'filter'}></div>
                        </div>
                        <div ref={'playButton'} className={'play-wrapper'} onClick={this.playAll}>
                            <div className={'play-button'}>
                                <i className={'icon-play'}></i>
                                <span>播放全部</span>
                            </div>
                        </div>
                    </div>
                    <div className={'album-content'} ref={'rankingContent'}>
                        <div className={'album-scroll'}>
                            <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                                <div className={'album-wrapper'}>
                                    <div className={'song-count'}>共{songs.length}首</div>
                                    <div className={'song-list'}>
                                        {newSongs}
                                    </div>
                                    <div className={'album-info'}>
                                        <div className={'album-title'}>介绍</div>
                                        <div className={'album-desc'}>
                                            {ranking.info}
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

export default rankingDetail;
