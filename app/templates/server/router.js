var express = require("express");
var router = express.Router();
var mappingList = require("../biz/mockData/mappingList.json");
/*
    mockServer可以自定义接口和对应文件的mapping关系,如果在mapping表中查不到则会执行默认规则.
    默认接口对应response文件名规则如下:
    eg:
    页面: 海外租车驾照翻译页
    接口名: /api-gateway/a/b/c
    对应文件位置: "/biz/mockData/" + bizName(rentCar/oversea/) + pageName(transDriverLicense/) + apiName(api-gateway-a-b-c.json)
 */

router.use(function(req, res) {
    var referUrl = req.headers.referer;
    var requestUrl = req.originalUrl.split("?")[0];
    var fileWholePath;
    if(mappingList[requestUrl]) {
        fileWholePath = mappingList[requestUrl];
    } else {
        var module = referUrl.split("release/")[1].split("/")[0];
        var moduleArr = module.split("-");
        moduleArr.splice(0,1);
        var projectPath = moduleArr.join("/");
        var pageName = referUrl.split("release/")[1].split("/")[1].split(".")[0];
        var jsonFilePath = "./biz/mockData/" + projectPath + "/" + pageName + "/";
        var jsonFileName = requestUrl.substr(1).split("/").join("-");
        fileWholePath = jsonFilePath + jsonFileName + ".json";
    }

    res.sendfile(fileWholePath);

});

router.get('/webapp-rentCar-oversea/transDriverLicense', function (req, res) {
    res.sendfile("./output/webapps/webapp-rentCar-oversea/transDriverLicense/transDriverLicense.html");
});

module.exports = router;