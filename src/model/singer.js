// 歌手model
export class Singer {
    constructor(id, mid, name, img) {
        this.id = id;
        this.mid = mid;
        this.name = name;
        this.img = img;
    }
}

export function createSingerSearch(data) {
    return new Singer(
        data.singerid,
        data.singermid,
        data.singername,
        `http://y.gtimg.cn/music/photo_new/T001R68x68M000${data.singermid}.jpg?max_age=2592000`
    );
}
