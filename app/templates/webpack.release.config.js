var path = require('path');
var webpack = require('webpack');
var pageCategory = require("./pageCategory.js");
var loadCommonConfig = require("./loadCommonConfig.js");
var env = process.env.NODE_ENV;
try {
    if(env == "local") {
        var perConf = require("./localConf.json")
    } else {
        var perConf = require("./releaseConf.json");
    }
} catch(e){}
var projectPath = perConf.projectPath || "";
var pageName = perConf.pageName || "";
var platform = perConf.platform;
var releaseFile = env != 'hybrid' ? "output/webapps/" : "new-release/";
/*
 extract-text-webpack-plugin插件，
 有了它就可以将你的样式提取到单独的css文件里，
 妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
 html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
 具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    output: {
        path: path.join(__dirname, releaseFile), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: env == "local" ? '/' : '/web-h5/resourceWeb/new-release/',               //模板、样式、脚本、图片等资源对应的server上的路径
        filename: '[name].js',           //每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
    },
    plugins: [
        new webpack.ProvidePlugin({ //加载jq
            $: 'zepto',
            hybrid: 'hybrid',
            comm: 'common',
            _: 'underscore',
            webapp: 'webapp'
        }),

        new ExtractTextPlugin('[name].css') //单独使用link标签加载css并设置路径，相对于output配置中的publicePath
    ]
};

function runtime(path, page) {
    var entryID;
    if(page.match("/")) {
        entryID = platform + '-' + path.replace("/","-") + "/" + page + "/" + page.split("/").pop(); // hybrid-rentCar-oversea/selectCity/selectCity

    } else {
        entryID = platform + '-' + path.replace("/","-") + "/" + page + "/" + page; // hybrid-rentCar-oversea/selectCity/selectCity
    }
    var fileRoute = path + "/" + page; //rentCar/oversea/selectCity
    module.exports.entry[entryID] = "./page/" + platform + "/assets/js/" + fileRoute + ".js";
    module.exports.plugins.push(new HtmlWebpackPlugin({
        //根据模板插入css/js等生成最终HTML
        filename: entryID + ".html",
        //生成的html存放路径，相对于path
        template: './page/' + platform + '/views/' + fileRoute + '.html',
        //js插入的位置，true/'head'/'body'/false
        inject: 'body',
        hash: true, //为静态资源生成hash值
        chunks: [entryID],//需要引入的chunk，不配置就会引入所有页面的资源
        minify: {
            removeComments: true,//移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    }));
}

function loadConfig(platform, path, page) {
    module.exports.entry= {};
    var platformPages = pageCategory[platform];
    var pageList= [];
    if(path) {
        if(page) {
            var eachPage = page.split(",");
            for(var i=0;i<eachPage.length;i++) {
                runtime(path, eachPage[i]);
            }
        } else {
            pageList = platformPages[path];
            for(var j=0;j<pageList.length;j++) {
                runtime(path, pageList[j]);
            }
        }
    } else {
        //不传path则监听所有页面
        for(var eachPath in platformPages) {
            pageList = platformPages[eachPath];
            for(var k=0;k<pageList.length;k++) {
                runtime(eachPath, pageList[k]);
            }
        }
    }
}
//if(env != "prod" && platform != "hybrid") {module.exports.devtool = "source-map"}
module.exports.resolve = loadCommonConfig(platform, projectPath).resolve;
module.exports.module = loadCommonConfig(platform, projectPath).module;
loadConfig(platform, projectPath, pageName);