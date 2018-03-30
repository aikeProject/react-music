/**
 * User: aike
 * Date: 2018/3/15 0015
 * Time: 21:05
 *
 */
import {connect} from 'react-redux';
import Player from '../component/play/Player/Player';
import {showPlayer, changeSong} from '../redux/actions';

/**
 *
 * @param showStatus
 * @param song
 * @param songs
 * @returns {{showStatus: *, song: *, songs: *}}
 */
const mapStateToProps = ({showStatus, song, songs}) =>{
    return {
        showStatus, currentSong: song, songs
    }
};
/**
 * 传递给组件的方法，用于改变redux状态
 * @param dispatch
 * @returns {{showMusicPlayer: (function(*=)), changeCurrentSong: (function(*=))}}
 */
const mapDispatchToProps = (dispatch) => {
    return {
        showMusicPlayer(status) {
            dispatch(showPlayer(status));
        },
        changeCurrentSong(song) {
            dispatch(changeSong(song));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
