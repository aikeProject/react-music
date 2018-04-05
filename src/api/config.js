// QQ音乐接口
const URL = {
    // 轮播接口
    carousel: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    // 专辑推荐
    recommend: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
    // 专辑详情
    albumInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
    // 歌曲vkey
    songKey: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
    // 歌曲排行榜
    rankingList: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
    // 歌曲排行详情
    rankingInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    // 搜索推荐接口
    searchList: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    // 搜索接口
    search: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
};
// 接口中相同的参数
const PARAM = {
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0
};
// jsonp请求的函数 jsonpCallback=callback
const OPTION = {
    param: 'jsonpCallback', // key
    prefix: 'callback' // value
};
// CODE_SUCCESS
const CODE_SUCCESS = 0;

export {URL, PARAM, OPTION, CODE_SUCCESS};

