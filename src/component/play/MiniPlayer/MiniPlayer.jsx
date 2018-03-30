import React, {Component} from 'react';
import './style.styl';
import Progress from '../Progress/Progress';

class MiniPlayer extends Component {
    render() {
        let {song, showStatus, progress, playOrPause, next, showMiniPlayer} = this.props;
        if (!song.img) {
            song.img = require('@/assets/imgs/logo.svg');
        }
        let playStyle = {};
        let imgStyle = {};
        if (showStatus === true) {
            playStyle = {display: 'none'};
        }
        if (song.playStatus === true) {
            imgStyle["WebkitAnimationPlayState"] = "running";
            imgStyle["animationPlayState"] = "running";
        } else {
            imgStyle["WebkitAnimationPlayState"] = "paused";
            imgStyle["animationPlayState"] = "paused";
        }
        let playButtonClass = song.playStatus === true ? "icon-pause" : "icon-play";
        return (
            <div className={'mini-player'} style={playStyle} onClick={(e) => {e.stopPropagation();showMiniPlayer()}}>
                <div className={'player-img rotate'} style={imgStyle}>
                    <img src={song.img} alt={song.name}/>
                </div>
                <div className={'player-center'}>
                    <div className={'progress-wrapper'}>
                        <Progress progress={progress} disableButton={true}/>
                    </div>
                    <div className={'song'}>
                        {song.name}
                    </div>
                    <div className={'singer'}>
                        {song.singer}
                    </div>
                </div>
                <div className={'player-right'}>
                    <i className={playButtonClass} onClick={(e) => {e.stopPropagation();playOrPause();}}></i>
                    <i className="icon-next ml" onClick={(e) => {e.stopPropagation();next()}}></i>
                </div>
                <div className={'filter'}></div>
            </div>
        )
    }
}

export default MiniPlayer;
