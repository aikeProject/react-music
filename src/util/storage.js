// 本地音乐持久话 H5的本地存储localStorage
let localStorage  = {
    setCurrentSong(song) {
        window.localStorage.setItem('song', JSON.stringify(song))
    },
    getCurrentSong() {
        const song = window.localStorage.getItem('song');
        return song ? JSON.parse(song) : {};
    },
    setSongs(songs) {
        window.localStorage.setItem('songs', JSON.stringify(songs))
    },
    getSongs() {
        const songs = window.localStorage.getItem('songs');
        return songs ? JSON.parse(songs) : [];
    }
};
export default localStorage;
