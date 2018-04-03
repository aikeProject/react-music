// 歌曲排行api
import {URL, PARAM, OPTION} from './config';
import jsonp from './jsonp';

// 获取排行榜列表
export function getRankgingList() {
    const data = Object.assign({}, PARAM, {
        g_tk: 1430612944,
        uin: 1121352970,
        platform: 'h5',
        needNewCode: 1,
        _: new Date().getTime(),
    });
    return jsonp(URL.rankingList, data, OPTION);
}

// 获取排行详情
export function getRankingInfo(topId) {
    // topId 排行榜id
    const data = Object.assign({}, PARAM, {
        g_tk: 1430612944,
        uin: 1121352970,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        _: new Date().getTime(),
        topid: topId,
    });
    return jsonp(URL.rankingInfo, data, OPTION);
}


