/**
 * 抓取网页内容
 */

/**
 * 生成虎牙的直播 URL
 * @param json_obj
 * @returns {string}
 */
function generateHuyaUrl(json_obj) {
    let live_info_arr = json_obj.data[0].gameStreamInfoList;
    let live_info = {};
    for (const live_tmp of live_info_arr) {
        if (live_tmp.sCdnType === 'BD') {
            live_info = live_tmp;
            break;
        }
        if (live_tmp.sCdnType === 'TX') {
            live_info = live_tmp;
            break;
        }
        if (live_tmp.sCdnType === 'AL') {
            live_info = live_tmp;
            break;
        }
        live_info = live_tmp;
    }
    return live_info.sHlsUrl + '/' + live_info.sStreamName + '.' + live_info.sHlsUrlSuffix + '?'
        + live_info.sHlsAntiCode.replace(/&amp;/g, '&');
}

/**
 * 抓取
 * @returns {string}
 */
function crawl() {
    let live_url = '';
    if (window.location.hostname.indexOf('huya.com') > -1) {
        let body_html = document.body.outerHTML;
        let re = /"stream"\s*:\s*(?<json_s>.*)\};/gm;
        let reg_obj = re.exec(body_html).groups;
        let json_res = reg_obj.json_s;
        let json_obj = window.JSON.parse(json_res);
        live_url = generateHuyaUrl(json_obj);
    }
    if (window.location.hostname.indexOf('m.douyu.com') > -1) { // douyu h5
        live_url = window.document.getElementById('html5player-video').src;
    }
    return live_url;
}

/**
 * 建立通信，接收按钮消息
 */
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    let action = request.action;
    if (action === 'yyf') { // 如果是要抓取地址
        let live_url = crawl();
        callback(live_url);
        let app_p = JSON.stringify({
            'url': live_url,
            'title': '',
        });
        let app_url = 'movistpro:' + encodeURIComponent(app_p);
        window.location.assign(app_url);
        return true;
    }
    callback('909090');
    return false;
});

