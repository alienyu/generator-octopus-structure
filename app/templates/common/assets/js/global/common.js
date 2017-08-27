require("../../css/common.less");
require('plugins-dialog');
require("Platform");
var path = require("path");

window.closePage = function() {
    hybrid.loadHLBridge(function() {
        HLBridge.call('rent_popToSchema', {
            schema: "home"
        });
    });
};
window.Omega = {
    productName: path.getPlatform() == "hybrid" ? 'hailang-rent-tracker' : "omega3b0d3e7e46"
};

var comm = {
    loadOmegaJs: function() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = location.protocol + "//webapp.didistatic.com/static/webapp/shield/z/omega/omega/0.1.8/omega.min.js";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(script);
    },
    wrapJson: function(prefix, json) {
        var newJson = {};
        for (var key in json) {
            var newKey = prefix + "." + key;
            newJson[newKey] = json[key];
        }
        return newJson;
    },
    dealAjaxData: function(json, callback, needLogin) {
        /*        var platform = path.getModuleName().split("-")[0];
                if (platform == "hybrid") {*/
        var platform = path.getPlatform();
        if (platform == "hybrid") {
            hybrid.signJson(json, callback);
        } else if (platform == "webapp") {
            webapp.wrapChannelData(json, callback, needLogin);
        }
    },
    getUrlParam: function(name,url) {
        var s_url = url?url:window.location.href;
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var index = s_url.indexOf('?');
        var r = s_url.substr(index + 1).match(reg); // 匹配目标参数
        if (r != null)
            return decodeURI(r[2]);
        return null; // 返回参数值
    },
    sendAjax: function(json) {
        var ajaxCurrent = $.ajax({
            url: json.url,
            type: json.type ? json.type : "get",
            data: json.data || {},
            dataType: "json",
            timeout: typeof(json.timeout)!="undefined" ? json.timeout : 10000,
            success: function(data) {
                
                if (json.callback && typeof json.callback === "function") {
                    json.callback(data);
                }
            },
            complete: function(XMLHttpRequest, status) {
                if(!json.ignoreTimeOut && status == 'timeout'){
                    comm.appendHtmlToBody();
                    if (ajaxCurrent) {
                        ajaxCurrent.abort();
                    }
                }
                json.complete && typeof json.complete==="function" && json.complete(XMLHttpRequest,status);
            },
            error: function(err) {
                $.dialog.close();
            }
        });
    },
    sendAjaxFailDom: function() {
        return "<div class='error_body'>" +
            "<div class='error_dom'>" +
            "<span class='error_icon'></span>" +
            "<p class='error_msg'>网络异常，点击重新加载</p>" +
            "<span class='reLoad' onclick='window.location.reload();'>重新加载</span>" +
            "</div>" +
            "</div>";
    },
    appendHtmlToBody: function() {
        var that = this;
        $("body").append(that.sendAjaxFailDom());
    },
    sendResult: function(sendData) {
        setTimeout(function() {
            window.client.api()('rent_result', window.client.stringify(sendData), function(jsonCall) {});
        }, 10);
    },
    rent_openUrl: function(url) {
        /*打开h5新页面*/
        window.client.api()("rent_openUrl", {
            url: url
        }, function(jsonCall) {});
    },
    set_title: function(title) {
        window.client.api()("updateNaviTitle", window.client.stringify({
            navi_title: title
        }), function(data) {});
    },
    set_main_height: function(h) {
        $(".main").css({
            height: (h - 12) + 'px'
        });
        $(".tab_box,.result_box").css({
            height: (h - 12) + 'px'
        });
    },
    searchInput: function() {
        $(".cancel").hide();
        $(".search_con").on("input", function() {
            $(".cancel").show();
        });
        $(".search_con").on("blur", function() {
            if ($(".search_con").val().length > 0) {
                $(".cancel").show();
            } else {
                $(".cancel").hide();
            }
        });
        comm.searchCancel();
    },
    searchCancel: function() {
        $(".cancel").on("click", function() {
            $(".search_con").val("");
            $("tab_con").show();
        });
    },
    doSearch: function(data, url, callBack) {
        comm.sendAjax(data, url, callBack);
    },
    maskShow: function() {
        var _html = "<div class='w_mask'></div>";
        $("body").append(_html);
    },
    maskHide: function() {
        $(".w_mask").remove();
    },
    tabSwitch: function(tabTil, tabCon, callBack) {
        tabTil.on("click", function() {
            tabTil.removeClass("hover");
            $(this).addClass("hover");
            tabCon.hide();
            tabCon.eq($(this).index()).show();
            if (callBack && typeof callBack === "function") {
                callBack();
            }
        });
    },
    comfirmBox: function() {
        $("#checkPY").on("click", function() {
            if ($("#checkPY").attr("checked") == true) {
                //    if($("#checkPY").parent().parent().hasClass("uncheck")){
                //        $("#checkPY").parent().parent().removeClass("uncheck").addClass("hover");
                //    }else{
                $("#checkPY").parent().parent().addClass("hover");
                //}
            } else {
                $("#checkPY").parent().parent().removeClass("hover");
            }
        });
    },
    getWeekDay: function(day) {
        var weekDay = "";
        switch (day) {
            case 1:
                weekDay = "周一";
                break;
            case 2:
                weekDay = "周二";
                break;
            case 3:
                weekDay = "周三";
                break;
            case 4:
                weekDay = "周四";
                break;
            case 5:
                weekDay = "周五";
                break;
            case 6:
                weekDay = "周六";
                break;
            case 7:
                weekDay = "周日";
                break;
            default:
                weekDay = "周日";
                break;
        }
        return weekDay;
    },
    setPos: function() {
        //获取基本信息
        var ua = window.navigator.userAgent;
        if (/android/i.test(ua)) { //android
            $(".e_pos").css({
                bottom: 0 + "px"
            });
        } else { //others include ios
            $(".e_pos").css({
                bottom: 20 + "px"
            });
        }
    },
    subDateSec: function(arg) {
        var tempDate = arg.split(":");
        var date = tempDate[0] + ":" + tempDate[1];
        return date;
    },

    commClosePage: function() {
        hybrid.loadHLBridge(function() {
            HLBridge.call("page_close");
        });
    },
    isLoginFun: function(callBack) {
        var ua = navigator.userAgent,
            version = ua.match(/didi\.passenger\/((\d+).(\d+).(\d+))/);
        if (HLBridge.versionDiff(version[1], '5.0.10', '>=')) {
            //端内登录
            HLBridge.call("callNativeLoginWithCallback", function(err, ret) {
                //公共部分ios和android登录成功后返回值不一样
                if (/android/i.test(ua)) { //android
                    if (ret.login_result == 0) {
                        location.reload(true);
                    }
                } else {
                    if (ret.success) {
                        location.reload(true);
                    }
                }
            });
        } else {
            if (callBack && typeof callBack === "function") {
                callBack();
            }
        }
    },
    loadCommonStyle: function() {},

    //判断是否是同一个页面
    isSamePage: function(target, source) {
        return target == source;
    },
    hidePageLoading: function() {
        $('#layer').hide();
        $('#floatingBarsG').hide();
    },

    formatData: function(date) {
        var tempDate = new Date(date);
        var year = tempDate.getYear();
        var month = tempDate.getMonth() + 1;
        var date = tempDate.getDate();
        var hour = tempDate.getHours();
        var min = tempDate.getMinutes();
        var second = tempDate.getSeconds();
        var fullDate = year + '-' - (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date) + ' ' + (hour > 9 ? hour : "0" + hour) + ':' + (min > 9 ? min : "0" + min) + ':' + second;
        return fullDate;
    },

    extendArray: function() {
        //数组去重 [1,2,3,4,1,2,36] => [1,2,3,4,36]
        Array.prototype.unique = function() {
            var tmpArr = [];
            for (var i = 0; i < this.length; i++) {
                if (tmpArr.indexOf(this[i]) == -1) {
                    tmpArr.push(this[i]);
                }
            }
            return tmpArr;
        }
    },

    pageInit: function(page_width) {
        //utilities.ready.dom(function () {
        if (!$('.page')[0]) return;
        page_width = page_width ? page_width : 750;
        ($('.page')[0].style.maxWidth = (page_width / 100) + 'rem');
        var _self = {};
        _self.width = page_width; //设置默认最大宽度
        _self.fontSize = 100; //默认字体大小
        _self.ratio = 320 / page_width;
        _self.widthProportion = function() {
            var p = document.documentElement.clientWidth / _self.width;
            if (p > 1) {
                return 1;
            }

            if (p < _self.ratio) {
                return _self.ratio;
            }
            return p;
        };
        _self.changePage = function() {
            document.documentElement.style.fontSize = _self.widthProportion() * _self.fontSize + 'px';
            console.log(document.documentElement.style.fontSize);
        };
        _self.changePage();
        window.addEventListener("resize", function() {
            _self.changePage();
        }, false);
        //});
        return this;
    },
    extendDate: function() {
        //数字日期转日历(1490177082535 => 2017-3-22 18:04)
        Date.prototype.formatDate = function() {
            var tempDate = new Date(tshis);
            var year = tempDate.getFullYear();
            var month = tempDate.getMonth() + 1;
            var date = tempDate.getDate();
            var hour = tempDate.getHours();
            var min = tempDate.getMinutes();
            var fullDate = year + "-" + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date) + ' ' + (hour > 9 ? hour : "0" + hour) + ':' + (min > 9 ? min : "0" + min);
            return fullDate;
        }
    },
    newOpen: function(url){
        if(Platform.isAlipay){
//          AlipayJSBridge && AlipayJSBridge.call('openInBrowser', {
//              url: url
//          });
        } else {
            url && (window.open(url));
        }
        
    },
    openUrl: function(url){
        url && (window.location.href = url);
    },
    setPageTitle: function(t){
        if(!t) return;
        document.title = t;
    },
    getAbsHref: function(href){
        var dom_a=document.createElement('a');
        dom_a.href=href;
        return dom_a.href;
    },
    setQueStr: function (url, ref, value) {//设置参数值
        var str = "";
        if (url.indexOf('?') != -1)
            str = url.substr(url.indexOf('?') + 1);
        else
            return url + "?" + ref + "=" + value;
        var returnurl = "";
        var setparam = "";
        var arr;
        var modify = "0";
    
        if (str.indexOf('&') != -1) {
            arr = str.split('&');
    
            for (i in arr) {
                if (arr[i].split('=')[0] == ref) {
                    setparam = value;
                    modify = "1";
                }
                else {
                    setparam = arr[i].split('=')[1];
                }
                returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
            }
    
            returnurl = returnurl.substr(0, returnurl.length - 1);
    
            if (modify == "0")
                if (returnurl == str)
                    returnurl = returnurl + "&" + ref + "=" + value;
        }
        else {
            if (str.indexOf('=') != -1) {
                arr = str.split('=');
    
                if (arr[0] == ref) {
                    setparam = value;
                    modify = "1";
                }
                else {
                    setparam = arr[1];
                }
                returnurl = arr[0] + "=" + setparam;
                if (modify == "0")
                    if (returnurl == str)
                        returnurl = returnurl + "&" + ref + "=" + value;
            }
            else
                returnurl = ref + "=" + value;
        }
        return url.substr(0, url.indexOf('?')) + "?" + returnurl;
    },
    delQueStr: function(url, ref){//删除参数值
        var str = "";
    
        if (url.indexOf('?') != -1)
            str = url.substr(url.indexOf('?') + 1);
        else
            return url;
        var arr = "";
        var returnurl = "";
        var setparam = "";
        if (str.indexOf('&') != -1) {
            arr = str.split('&');
            for (var i=0;i<arr.length;i++) {
                if (arr[i].split('=')[0] != ref) {
                    returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                }
            }
            return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
        }
        else {
            arr = str.split('=');
            if (arr[0] == ref)
                return url.substr(0, url.indexOf('?'));
            else
                return url;
        }
    },
    addDataToUrl: function(url, data, deep){
        if(!url) return '';
        if(typeof(deep)==="undefined") deep = true;
        if(data && Object.prototype.toString.call(data) === "[object Object]"){
            var d = comm.getUrlParam('data',url);
            if(d){
                d = JSON.parse(d);
                for(var key in data){
                    if(deep) d[key] = data[key];
                }
                url = comm.delQueStr(url,'data');
                url = comm.setQueStr(url,'data',JSON.stringify(d))
                return url;
            } else {
                return comm.setQueStr(url,'data',JSON.stringify(data))
            }
        }
        return url;
    },
    errNoFun:function(text,btnText,url,type){
        comm.maskShow();
        var alertType = "";
        type && type!="" ? alertType=type : alertType="tips";
        $.dialog.alert({
            "content": text,
            "type": alertType, //自定义图标
            "confirm": {
                text: btnText,
                callback: function(){
                    comm.maskHide();
                    if(url){
                        comm.openUrl(url);
                    }else{
                        $.dialog.close();
                    }
                }
            }
        });
    },
    bindPopupDom:function(txt){
        var me = this;
        var _dom = '<div class="popup popup_rule white"><div class="popup_text"  id="popup_rule">'+ txt +'</div><span class="icon icon_card_close e_addr_close"></span></div>';
        if(!$("body").hasClass("popup_rule")){
            $("body").append(_dom);
        }else{
            $(".popup_rule").show();
        }
        me.bindClosePopupDom();
        me.maskShow();
    },
    bindClosePopupDom:function(){
        var me = this;
        $(".e_addr_close").on("click",function(){
            if($("body").hasClass("popup_rule")){
                $(".popup_rule").hide();
            }
            me.maskHide();
        });
    }
};
comm.loadOmegaJs();
comm.extendArray();
comm.extendDate();
module.exports = comm;