import React, {Component} from 'react';
import Player from '@/containers/Player';
import PlayerList from '@/containers/PlayerList';

class MusicPlayer extends Component {
    constructor() {
        super();
        this.state = {
            currentSongIndex: 0,
            show: false
        }
    }

    // 改变播放歌曲
    changeCurrentSongIndex = (index) => {
        this.setState({
            currentSongIndex: index,
        })
    };
    // 显示隐藏列表
    showList = (status) => {
        this.setState({show: status})
    };

    render() {
        return (
            <div className={'music-player'}>
                <Player
                    currentIndex={this.state.currentSongIndex}
                    showList={this.showList}
                    changeCurrentSongIndex={this.changeCurrentSongIndex}
                />
                <PlayerList
                    currentIndex={this.state.currentSongIndex}
                    show={this.state.show}
                    showList={this.showList}
                    changeCurrentSongIndex={this.changeCurrentSongIndex}
                />
            </div>
        )
    }
}

export default MusicPlayer;
