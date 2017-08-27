/* var pageListExample = {
    "web": {
        "rentCar/oversea/": [
            "addDriver",
            "carDetail",
            "carList",
            "confirmOrder",
            "orderList",
            "orderResult",
            "selectCity",
            "transDriverLicense",
            "fetchCarForm",
            "welfare",
            "storeMap",
            "help",
            "helpSub",
            "helpDtl"
        ]
    }
}
*/
var pageList = {};
var platformList = ["web", "mobile"];
for(var i=0;i<platformList.length;i++) {
    var platform = platformList[i];
    var route = "./config/pageList/" + platform + ".json";
    pageList[platform] = require(route);
}

module.exports = pageList;