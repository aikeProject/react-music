// 使用jsonp模块解决跨域问题
import getJsonp from 'jsonp';

// 用promis封装jsonp方法
/**
 *
 * @param url 请求链接
 * @param data 传递的参数
 * @param option 定义请求形式  callback
 * @returns {Promise} 返回promis对象
 */
let jsonp = (url, data, option) => {
    return new Promise((resolve, reject) => {
        getJsonp(urlModal(url, data), option, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};

/**
 * 在url链接上添加请求参数
 * @param url
 * @param data
 */
function urlModal(url, data) {
    let params = [];
    // 属性=属性值
    for (var item in data) {
        params.push(`${item}=${data[item]}`);
    }
    let param = params.join('&');
    if (url.indexOf('?')===-1) {
        url += '?' + param;
    } else {
        url += '&' + param;
    }
    return url;
}

export default jsonp;