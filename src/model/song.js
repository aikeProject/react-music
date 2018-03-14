/**
 * User: aike
 * Date: 2018/3/12 0012
 * Time: 18:58
 *
 */

/**
 * 歌曲模型
 */
export class Song {
    constructor(id, mId, name, img, duration, url, singer) {
        this.id = id;
        this.mId = mId;
        this.name = name;
        this.img = img;
        this.duration = duration;
        this.url = url;
        this.singer = singer
    }
}

export function createSong(data) {
    return new Song(
        data.songid,
        data.songmid,
        data.songname,
        `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
        data.interval,
        "",
        filterSinger(data.singer)
    )
}

// 歌手
function filterSinger(singers) {
    // 获取歌手的姓名
    let singerArr = singers.map((value) => {
        return value.name;
    });
    // 阿含/陶喆
    return singerArr.join('/');
}

