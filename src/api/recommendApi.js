// 推荐页的接口
import jsonp from './jsonp';
import {URL, OPTION, PARAM} from './config';

// 获取轮播数据
function getCarousel() {
    const data = Object.assign({}, PARAM, {
        g_tk: 749970884,
        platform: 'h5',
        needNewCode: 1,
        _: new Date().getTime(),
        uin: 1,
    });
    return jsonp(URL.carousel, data, OPTION);
}

// 获取推荐列表数据
function getRecommendList() {
    const data = Object.assign({}, PARAM, {
        g_tk: 1162689203,
        needNewCode: 0,
        hostUin: 0,
        platform: 'yqq',
        data: `{
            "albumlib": {
                "method": "get_album_by_tags",
                "param": {
                    "area": 7,
                    "company": -1,
                    "genre": 1,
                    "type": -1,
                    "year": -1,
                    "sort": 2,
                    "get_tags": 1,
                    "sin": 0,
                    "num": 20,
                    "click_albumid": 0
                },
                "module": "music.web_album_library"
            }
        }`
    });
    const OPTION = {
        param: 'callback',
        prefix: 'callback'
    };
    return jsonp(URL.recommend, data, OPTION);
}

// 获取专辑详情
function getAlbumInfo(albumMid) {
    const data = Object.assign({}, PARAM, {
        albummid: albumMid,
        g_tk: 1278911659,
        hostUin: 0,
        platform: "yqq",
        needNewCode: 0
    });
    return jsonp(URL.albumInfo, data, OPTION);
}

export {getCarousel, getRecommendList, getAlbumInfo};
