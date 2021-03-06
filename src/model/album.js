/**
 * 使用类模型的好处可以使代码重复利用，方便后续继续使用，
 * ui对应的数据清晰，把ui需要的字段统一作为类的属性，根据属性就能很清楚的知道ui需要哪些数据
 */

/* ********  专辑模型，定义专辑需要的字段 ******** */
export class Album {
    constructor(id, mId, name, img, singer, publicTime) {
        this.id = id;
        this.mId = mId;
        this.name = name;
        this.img = img;
        this.singer = singer;
        this.publicTime = publicTime;
    }
}

/**
 * 实例化专辑模型，创建专辑列表
 * @param data
 * @returns {Album}
 */
export function createAlbumByList(data) {
    return new Album(
        data.album_id, //
        data.album_mid, // 专辑id
        data.album_name, // 专辑名称
        `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.album_mid}.jpg?max_age=2592000`, // 专辑图片地址
        filterSinger(data.singers),
        data.public_time, // 发行时间
    )
}

/**
 * 专辑详情数据创建专辑对象函数
 * @param data 专辑的详情数据
 */
export function createAlbumByDetail(data) {
    return new Album(
        data.id,
        data.mid, // 专辑id
        data.name,
        `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.mid}.jpg?max_age=2592000`, // 专辑图片
        data.singername,
        data.aDate
    )
}

export function createAlbumBySearch(data) {
    return new Album(
        data.albumid,
        data.albummid,
        data.albumname,
        `http://y.gtimg.cn/music/photo_new/T002R68x68M000${data.albummid}.jpg?max_age=2592000`,
        data.singername,
        "",
    )
}

// 歌手
function filterSinger(singers) {
    // 获取歌手的姓名
    let singerArr = singers.map((value) => {
        return value.singer_name;
    });
    // 阿含/陶喆
    return singerArr.join('/');
}
