// 歌曲搜索
import jsonp from './jsonp';
import {URL, OPTION, PARAM} from './config';

// 推荐搜索
export function getSearchList() {
    const data = Object.assign({}, PARAM, {
        g_tk: 1430612944,
        uin: 1121352970,
        platform: 'h5',
        needNewCode: 1,
        _: new Date().getTime(),
    });
    return jsonp(URL.searchList, data, OPTION);
}

// 搜索
export function getSearch(w) {
    const data = Object.assign({}, PARAM, {
        g_tk: 1430612944,
        uin: 1121352970,
        platform: 'h5',
        needNewCode: 1,
        zhidaqu: 1,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: 20,
        p: 1,
        remoteplace: 'txt.mqq.all',
        _: new Date().getTime(),
        w: w, // 搜索内容
    });
    return jsonp(URL.search, data, OPTION);
}
