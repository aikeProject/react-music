import React, {Component} from 'react';
import Scroll from '@/common/scroll/Scroll';
import ReactDOM from 'react-dom';
import {CSSTransition} from 'react-transition-group';
import './style.styl'

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showList: false
        };
        this.changeIndex = {
            shouldChange: false,
            index: 0
        }
    }

    // 关闭歌曲列表
    hideList = () => {
        this.props.showList(false);
    };
    // 播放选中歌曲
    selectSong = (song, index) => {
        const {changeCurrentSong, changeCurrentSongIndex} = this.props;
        return () => {
            changeCurrentSong(song);
            changeCurrentSongIndex(index);
            this.hideList();
        }
    };
    // 删除选中歌曲
    removeSong = (id, index) => {
        const {removeSong, currentSong, currentIndex, changeCurrentSongIndex} = this.props;
        return () => {
            if (currentSong.id !== id) {
                removeSong(id);
                // 如果当前位置大于删除的歌曲位置，-1保持当前歌曲不变
                if (index < currentIndex) {
                    changeCurrentSongIndex(currentIndex - 1);
                }
            }
        }
    };
    // 定位到当前歌曲
    scrollCurrent = () => {
        const {currentIndex} = this.props;
        this.refs.scroll.bScroll.scrollToElement(
            ReactDOM.findDOMNode(this.refs[`item${currentIndex}`])
        )
    };

    componentDidUpdate() {
        const {changeCurrentSongIndex} = this.props;
        // 组件更新后，重置歌曲为当前的位置
        if (this.changeIndex.shouldChange === true) {
            changeCurrentSongIndex(this.changeIndex.index);
            this.changeIndex.shouldChange = false;
        }
    }

    render() {
        const {playSongs, show, currentSong} = this.props;
        console.log(playSongs);
        const playList = playSongs.map((song, index) => {
            let isCurrent = false;
            if (song.id === currentSong.id) {
                isCurrent = true;
                this.changeIndex = {
                    shouldChange: true,
                    index
                }
            }
            return (
                <div className={'play-list-item'} key={song.id} ref={`item${index}`} onClick={this.selectSong(song, index)}>
                    <div className={'item-left'}>
                        <span>{index < 10 ? `0${index}` : index}</span>
                        <div className={isCurrent ? 'song current' : 'song'}>
                            <span className={'song-name'}>{song.name}</span>
                            <span className={'song-singer'}>{song.singer}</span>
                        </div>
                    </div>
                    <div className={'item-right'} onClick={(e) => {e.stopPropagation();}}>
                        <i className={'icon-delete delete'} onClick={this.removeSong(song.id, index)}></i>
                    </div>
                </div>
            )
        });
        return (
            <div className={'player-list'}>
                <CSSTransition in={show} classNames={'fade'} timeout={500}
                               onEnter={() => {
                                   this.setState({showList: true})
                               }}
                               onEntered={() => {
                                   this.refs.scroll.refresh();
                                   this.scrollCurrent();
                               }}
                               onExited={() => {
                                   this.setState({showList: false});
                                   this.scrollCurrent();
                               }}
                >
                    <div className={'play-list-bg'}
                         style={this.state.showList === true ? {display: "block"} : {display: "none"}}
                         onClick={this.hideList}>
                        <div className={'play-list-wrap'} onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            <div className={'play-list-head'}>
                                <span className={'head-title'}>播放列表</span>
                                <span className={'close'} onClick={this.hideList}>关闭</span>
                            </div>
                            <div className={'play-list'}>
                                <Scroll ref={'scroll'}>
                                    {playList}
                                </Scroll>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
            </div>
        )
    }
}

export default PlayerList;
