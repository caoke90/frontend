export default {
    getBrowser: function () {
        let Sys = {};
        let ua = navigator.userAgent.toLowerCase();
        let s;
        //if else{if else{if else{}}}
        (s = ua.match(/msie ([\d.]+)/))
        ? Sys.ie = s[1]
        :(s = ua.match(/firefox\/([\d.]+)/))
        ? Sys.firefox = s[1]
        :(s = ua.match(/chrome\/([\d.]+)/))
        ? Sys.chrome = s[1]
        :(s = ua.match(/opera.([\d.]+)/))
        ? Sys.opera = s[1]
        :(s = ua.match(/version\/([\d.]+).*safari/))
        ? Sys.safari = s[1]
        : 0;

        if (Sys.ie) {
            return 'IE: ' + Sys.ie;
        }
        if (Sys.firefox) {
            return 'Firefox: ' + Sys.firefox;
        }
        if (Sys.chrome) {
            return 'Chrome: ' + Sys.chrome;
        }
        if (Sys.opera) {
            return 'Opera: ' + Sys.opera;
        }
        if (Sys.safari) {
            return 'Safari: ' + Sys.safari;
        }
        return 'no:no';
    },
    getBrowserName(){
        let broswerName=this.getBrowser().split(':')[0];
        return broswerName;
    }
    ,
    getBrowserVersion(){
        let broswer=this.getBrowser();
        return (broswer+"").replace(/[^0-9.]/ig, "");
    }
}