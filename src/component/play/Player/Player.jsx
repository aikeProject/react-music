/**
 * User: aike
 * Date: 2018/3/15 0015
 * Time: 21:03
 *
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './style.styl';
import Progress from '../Progress/Progress';
import {getTime} from '@/util/common';
import {CSSTransition} from 'react-transition-group';
import {Song} from '@/model/song';
import MiniPlayer from '../MiniPlayer/MiniPlayer';

class Player extends Component {
    constructor() {
        super();
        this.currentSong = new Song(0, '', '', '', 0, '', '');
        this.currentIndex = 0;
        // 拖拽进度
        this.dragProgress = 0;
        this.isFirstPlay = true;
        // 播放模式
        this.playModes = ['list', 'single', 'shuffle'];

        this.state = {
            currentTime: 0,
            playProgress: 0,
            playStatus: false,
            currentPlayMode: 0
        }
    }

    /*        歌曲控制        */

    // 切换歌曲模式
    changePlayMode() {
        if (this.state.currentPlayMode === this.playModes.length - 1) {
            this.setState({currentPlayMode: 0});
        } else {
            this.setState({currentPlayMode: this.state.currentPlayMode + 1});
        }
    }

    //播放暂停
    playOrPasuse() {
        if (this.audioDOM.paused) {
            this.audioDOM.play();
            this.startImgRotate();
            this.setState({playStatus: true});
        } else {
            this.audioDOM.pause();
            this.stopImgRotate();
            this.setState({playStatus: false});
        }
    }

    // 上一首 下一首
    preSong = () => { // 上一曲
        const {songs, changeCurrentSong, changeCurrentSongIndex} = this.props;
        const {currentPlayMode} = this.state;
        if (songs.length > 0 && songs.length !== 1) {
            let currentIndex = this.currentIndex;
            // 列表播放
            if (currentPlayMode === 0) {
                if (currentIndex === 0) {
                    currentIndex = songs.length - 1;
                } else {
                    currentIndex -= 1;
                }
            } else if (currentPlayMode === 1) { // 单曲循环
                currentIndex = this.currentIndex;
            } else if (currentPlayMode === 2) { // 随机播放
                let index = Math.round(Math.random() * (songs.length));
                currentIndex = index;
            }
            changeCurrentSong(songs[currentIndex]);
            // this.currentIndex = currentIndex;
            changeCurrentSongIndex(currentIndex);
        }
    };
    nextSong = () => { // 下一曲
        const {songs, changeCurrentSong, changeCurrentSongIndex} = this.props;
        const {currentPlayMode} = this.state;
        if (songs.length > 0 && songs.length !== 1) {
            let currentIndex = this.currentIndex;
            // 列表播放
            if (currentPlayMode === 0) {
                if (currentIndex === songs.length - 1) {
                    currentIndex = 0;
                } else {
                    currentIndex += 1;
                }
            } else if (currentPlayMode === 1) { // 单曲循环
                currentIndex = this.currentIndex;
            } else if (currentPlayMode === 2) { // 随机播放
                let index = Math.round(Math.random() * (songs.length));
                currentIndex = index;
            }
            changeCurrentSong(songs[currentIndex]);
            // this.currentIndex = currentIndex;
            changeCurrentSongIndex(currentIndex);
        }
    };

    // 进度条
    handleStart = (progress) => {
        const audioDOM = this.audioDOM;
        if (audioDOM.duration > 0) {
            let currentTime = audioDOM.duration * progress;
            this.setState({
                playProgress: progress,
                currentTime: currentTime
            }, () => {
                // 设置播放进度
                audioDOM.currentTime = currentTime;
                audioDOM.play();
                this.startImgRotate();
                this.setState({playStatus: true});
                this.dragProgress = 0;
            });
        }
    };
    handleDrag = (progress) => {
        const audioDOM = this.audioDOM;
        if (audioDOM.duration > 0) {
            audioDOM.pause(); // 暂停
            this.stopImgRotate();
            this.setState({playStatus: false, playProgress: progress});
            this.dragProgress = progress;
        }
    };
    handleEnd = () => {
        const audioDOM = this.audioDOM;
        if (audioDOM.duration > 0) {
            let currentTime = audioDOM.duration * this.dragProgress;
            this.setState({
                playProgress: this.dragProgress,
                currentTime: currentTime
            }, () => {
                // 设置播放进度
                audioDOM.currentTime = currentTime;
                audioDOM.play();
                this.startImgRotate();
                this.setState({playStatus: true});
                this.dragProgress = 0;
            });
        }
    };

    /*        歌曲控制END      */

    componentDidUpdate() {
        if (this.isFirstPlay === true) {
            this.audioDOM.play();
            this.isFirstPlay = false;
        }
    }

    componentDidMount() {
        this.audioDOM = ReactDOM.findDOMNode(this.refs.audio);
        this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
        this.playerDOM = ReactDOM.findDOMNode(this.refs.player);
        this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg);

        // 切换新的src触发
        this.audioDOM.addEventListener('canplay', () => {
            this.audioDOM.play();
            this.startImgRotate();
            this.setState({
                playStatus: true
            })
        });
        // 获取播放时间和进度
        this.audioDOM.addEventListener('timeupdate', () => {
            if (this.state.playStatus === true) {
                this.setState({
                    // 播放进度
                    playProgress: this.audioDOM.currentTime / this.audioDOM.duration,
                    // 当前时间
                    currentTime: this.audioDOM.currentTime
                })
            }
        }, false);

        // 播放完毕
        this.audioDOM.addEventListener('ended', () => {
            const {songs, changeCurrentSong, changeCurrentSongIndex} = this.props;
            const {currentPlayMode} = this.state;
            if (songs.length > 1) {
                let currentIndex = this.currentIndex;
                // 列表循环播放
                if (currentPlayMode === 0) {
                    if (currentIndex === songs.length - 1) {
                        currentIndex = 0;
                    } else {
                        currentIndex += 1;
                    }
                } else if (currentPlayMode === 1) { // 单曲循环
                    // 继续歌曲
                    this.audioDOM.play();
                    return;
                } else if (currentPlayMode === 2) { // 随机播放
                    let index = Math.round(Math.random() * (songs.length));
                    currentIndex = index;
                }
                changeCurrentSong(songs[currentIndex]);
                // this.currentIndex = currentIndex;
                changeCurrentSongIndex(currentIndex);
            } else {
                // 如果只有一首歌，继续单曲循环单曲循环
                if (currentPlayMode === 1) {
                    this.audioDOM.play();
                } else {
                    // 其他模式停止播放
                    this.audioDOM.pause();
                    this.stopImgRotate();
                    this.setState({
                        playStatus: false,
                    })
                }
            }
        }, false);

        // 播放错误
        this.audioDOM.addEventListener('error', () => {
            alert('播放错误！');
        }, false);
    }

    // 图片旋转
    startImgRotate = () => {
        if (this.singerImgDOM.className.indexOf('rotate') === -1) {
            this.singerImgDOM.classList.add('rotate');
        } else {
            this.singerImgDOM.style["webkitAnimationPlayState"] = "running";
            this.singerImgDOM.style["animationPlayState"] = "running";
        }
    };
    // stop图片旋转
    stopImgRotate = () => {
        this.singerImgDOM.style["webkitAnimationPlayState"] = "paused";
        this.singerImgDOM.style["animationPlayState"] = "paused";
    };

    // 隐藏播放器
    hidePlayre = () => {
        this.props.showMusicPlayer(false);
    };

    // 显示播放器
    showPlayer = () => {
        this.props.showMusicPlayer(true);
    };

    render() {
        let song = this.currentSong;
        const {currentSong, showStatus, showList, currentIndex} = this.props;
        this.currentIndex = currentIndex; // 歌曲播放位置
        let playBg = song.img ? song.img : require('@/assets/imgs/play_bg.jpg');
        let playButtonClass = this.state.playStatus === true ? 'icon-pause' : 'icon-play';
        song.playStatus = this.state.playStatus;
        if (currentSong && currentSong.url) {
            // 歌曲发生变化
            if (this.currentSong.id !== currentSong.id) {
                this.currentSong = currentSong;
                this.audioDOM.src = this.currentSong.url;
                this.audioDOM.load();
            }
        }
        return (
            <div className={'player-container'}>
                <CSSTransition in={showStatus} timeout={300} classNames={'player-rotate'} onEnter={() => {
                    this.playerDOM.style.display = 'block';
                }} onExited={() => {
                    this.playerDOM.style.display = 'none';
                }}>
                    <div className={'player'} ref={'player'}>
                        <div className={'header'}>
                        <span className={'header-back'} onClick={this.hidePlayre}>
                            <i className={'icon-back'}></i>
                        </span>
                            <div className={'header-title'}>
                                {song.name}
                            </div>
                        </div>
                        <div className={'singer-top'}>
                            <div className={'singer'}>
                                <div className={'singer-name'}>
                                    {song.singer}
                                </div>
                            </div>
                        </div>
                        <div className={'singer-middle'}>
                            <div className={'singer-img'} ref={'singerImg'}>
                                {/*// http://y.gtimg.cn/music/photo_new/T002R300x300M000003yeNV10Tzs9v.jpg?max_age=2592000*/}
                                <img src={playBg} alt={song.name} onLoad={
                                    (e) => {
                                        this.playerBgDOM.style.backgroundImage = `url(${playBg})`
                                    }
                                }/>
                            </div>
                        </div>
                        <div className={'singer-bottom'}>
                            <div className={'wrapper'}>
                                <div className={'progress-wrapper'}>
                                    <span className={'current-time'}>{getTime(this.state.currentTime)}</span>
                                    <div className={'progress-play'}>
                                        <Progress progress={this.state.playProgress}
                                                  onDragStart={this.handleStart}
                                                  onDrag={this.handleDrag}
                                                  onDragEnd={this.handleEnd}/>
                                    </div>
                                    <span className={'total-time'}>{getTime(song.duration)}</span>
                                </div>
                                <div className={'play-wrapper'}>
                                    <div className={'play-mode-bottom'} onClick={this.changePlayMode.bind(this)}>
                                        <i className={'icon-' + this.playModes[this.state.currentPlayMode] + '-play'}></i>
                                    </div>
                                    <div className={'previous-button'} onClick={this.preSong}>
                                        <i className={'icon-previous'}></i>
                                    </div>
                                    <div className={'play-button'} onClick={this.playOrPasuse.bind(this)}>
                                        <i className={playButtonClass}></i>
                                    </div>
                                    <div className={'next-play'} onClick={this.nextSong}>
                                        <i className={'icon-next'}></i>
                                    </div>
                                    <div className={'play-list-button'} onClick={() => {
                                        showList(true)
                                    }}>
                                        <i className={'icon-play-list'}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'player-bg'} ref={'playerBg'}></div>
                        <audio ref={'audio'}></audio>
                    </div>
                </CSSTransition>
                <MiniPlayer
                    song={song}
                    progress={this.state.playProgress}
                    playOrPause={this.playOrPasuse.bind(this)}
                    next={this.nextSong}
                    showStatus={showStatus}
                    showMiniPlayer={this.showPlayer}/>
            </div>
        )
    }
}

export default Player;
