import {connect} from 'react-redux';
import PlayerList from '../component/play/PlayerList/PlayerList';
import {changeSong, removeSong} from '../redux/actions';

// 将state数据添加到PlayerList上
const mapStateProps = ({song, songs}) => {
    return {
        currentSong: song,
        playSongs: songs,
    }
};

// dispatch
const mapDispatchProps = (dispatch) => {
    return {
        changeCurrentSong: (song) => {
            dispatch(changeSong(song));
        },
        removeSong: (id) => {
            dispatch(removeSong(id))
        }
    }
};

export default connect(mapStateProps, mapDispatchProps)(PlayerList);
