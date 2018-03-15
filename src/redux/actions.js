/**
 * User: aike
 * Date: 2018/3/14 0014
 * Time: 18:03
 *
 */
// action 是store数据的唯一来源
import {SHOW_PLAYER, CHANGE_SONG, REMOVE_SONG_FROM_LIST, SET_SONGS} from './actionTypes';

export function showPlayer(showStatus) {
    return {type: SHOW_PLAYER, showStatus};
}

export function changeSong(song) {
    return {type: CHANGE_SONG, song};
}

export function removeSong(id) {
    return {type: REMOVE_SONG_FROM_LIST, id};
}

export function setSongs(songs) {
    return {type: SET_SONGS, songs};
}

