/**
 * User: aike
 * Date: 2018/3/14 0014
 * Time: 18:03
 *
 */
// combineReducers 合并reducer
/**
 * reducer就是一个纯函数，接收旧的state和action，返回新的state
 */
import {combineReducers} from 'redux';
import {CHANGE_SONG, SET_SONGS, SHOW_PLAYER, REMOVE_SONG_FROM_LIST} from "./actionTypes";

// 初始状态数据
const initState = {
    showStatus: false, // 控制播放状态
    song: {}, // 当前播放
    songs: [] // 播放列表
};

/**
 * 控制歌曲状态
 * @param showStatus 初值
 * @param action 传入的新action，用于更新数据
 * @returns {boolean} 返回新的state
 */
function showStatus(showStatus = initState.showStatus, action) {
    switch (action.type) {
        case SHOW_PLAYER:
            return action.showStatus;
        default:
            return showStatus;
    }
}

/**
 * 当前播放歌曲
 * @param song
 * @param action
 * @returns {initState.song|{}}
 */
function song(song = initState.song, action) {
    switch (action.type) {
        case CHANGE_SONG:
            return action.song;
        default:
            return song;
    }
}

/**
 * 歌曲列表的添加和删除
 * @param songs
 * @param action
 * @returns {*}
 */
function songs(songs = initState.songs, action) {
    switch (action.type) {
        case SET_SONGS:
            return action.songs;
        case REMOVE_SONG_FROM_LIST:
            return songs.filter(song => song.id !== action.id);
        default:
            return songs;
    }
}

const reducer = combineReducers({
    showStatus,
    song,
    songs
});

export default reducer;
