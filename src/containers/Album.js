/**
 * User: aike
 * Date: 2018/3/14 0014
 * Time: 20:05
 *
 */
import {connect} from 'react-redux';
import {showPlayer, changeSong, setSongs} from '../redux/actions';
import Album from '../component/album/Album';

/**
 * 将改变redux状态的方法放到props上
 * @param dispatch
 * @returns {{showMusicPlayer: (function(*=)), changeCurrentSong: (function(*=)), setMusicSongs: (function(*=))}}
 */
const mapDispatchToProps = (dispatch) => {
  return {
      showMusicPlayer: (status) => {
        dispatch(showPlayer(status));
      },
      changeCurrentSong: (status) => {
          dispatch(changeSong(status));
      },
      setMusicSongs: (status) => {
          dispatch(setSongs(status));
      }
  }
};
export default connect(null, mapDispatchToProps)(Album);

