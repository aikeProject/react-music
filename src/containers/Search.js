import {connect} from 'react-redux';
import {showPlayer, changeSong, setSongs} from '../redux/actions';
import Search from '../component/search/Search';

const mapDispatchToProps = (dispatch) => {
    return {
        showMusicPlayer(show) {
            dispatch(showPlayer(show));
        },
        changeCurrentSong(song) {
            dispatch(changeSong(song));
        },
        setSongs(songs) {
             dispatch(setSongs(songs));
        }
    }
};

export default connect(null, mapDispatchToProps)(Search);
