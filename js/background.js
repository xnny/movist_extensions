/**
 * 监控事件
 */
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {'action': 'yyf'}, function (response) {
        if (response === undefined) {
            return false;
        }
        console.log(response);
        return true;
    });
});