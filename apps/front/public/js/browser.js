/**
 * Unsupported browser detector
 */

 /**
  * Get Browser from User Agent
  */
function get_browser() {
  var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: (tem[1] || '') };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/)
    if (tem != null) { return { name: 'Opera', version: tem[1] }; }
  }
  if (window.navigator.userAgent.indexOf("Edge") > -1) {
    tem = ua.match(/\Edge\/(\d+)/)
    if (tem != null) { return { name: 'Edge', version: tem[1] }; }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
  return {
    name: M[0],
    version: +M[1]
  };
}

/**
 * Support ALL execpt IE
 * @param {string} browser
 */
function isSupported(browser) {
  var supported = true;
  if (browser.name === "MSIE" || (browser.name === "IE" && browser.version < 11)) {
    supported = false;
  }
  return supported;
}

var browser = get_browser()
var isSupported = isSupported(browser);

if (!isSupported) {
  window.location.href = 'unsupported-browser.html';
}
