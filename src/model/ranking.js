// 歌曲排行榜模型
export class Ranking {
    constructor(id, title, img, songs) {
        this.id = id;
        this.title = title;
        this.img = img;
        this.songs = songs;
    }
}

export function createRankingByList(data) {
    return new Ranking(
        data.id,
        data.topTitle,
        data.picUrl,
        data.songList
    );
}

// 排行榜详情
export function createRankingByInfo(data) {
    return new Ranking(
        data.topId,
        data.ListName,
        data.pic_album,
        ''
    );
}


