/**
 * User: aike
 * Date: 2018/3/16 0016
 * Time: 12:52
 *
 */
/**
 * 获取css属性值
 * @param oElement 节点
 * @param sName 属性名
 * @returns {*}
 */
function getStyle(oElement, sName){
    // currentStyle ie
    // getComputedStyle 其它
    return oElement.currentStyle ? oElement.currentStyle[sName] : getComputedStyle(oElement, null)[sName];
}

/**
 * 设置时间格式 00: 00
 * @param second
 * @returns {string}
 */
function getTime(option) {
    let second = Math.floor(option); // 秒
    let minute = Math.floor(second / 60); // 分
    second = second - minute * 60; // 剩余秒
    return `${minute}:${formatTime(second)}`
}
function formatTime(second) {
    let timeStr = '00';
    // 1 --- 10 秒 补一个0
    if (second>0 && second < 10) {
        timeStr = '0' + second;
    } else {
        timeStr = second;
    }
    return timeStr;
}
export {getStyle, getTime};
