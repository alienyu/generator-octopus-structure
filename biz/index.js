'use strict';
const Generator = require('yeoman-generator');
const chalk = require("chalk");
const deasync = require("deasync");
const open = require("open");
const yosay = require('yosay');
const _ = require("lodash");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.log(yosay(chalk.green("start build octopus biz and page")));

        this.option("testCase", {
            desc: 'set default projectPath and pageName for create test case',
            type: Boolean,
            defaults: false
        })
    }

    prompting() {
        var done = this.async();
        var prompt = [{
            type: "list",
            name: "platform",
            message: "Please choose your biz's platform",
            choices: ['web', 'mobile']
        }, {
            type: "input",
            name: "projectPath",
            message: "Please enter the project name,if it has sub project ,using '/' to isolate them(rentCar/oversea)",
            validate: function(value) {
                if(!value.match(/\w+/)) {
                    return false;
                    done("project name must be characters");
                }
                return true;
            }
        }, {
            type: "input",
            name: "pageName",
            message: "Please enter the page name,if it has sub page ,using '/' to isolate them(bill/index).If you want to add server page,using comma to isolate them(pageA,pageB,....)",
            validate: function (value) {
                if(!value.match(/\w+/)) {
                    return false;
                    done("page name must be characters");
                }
                return true;
            }
        }, {
            type: "input",
            name: "pageTitle",
            message: "Please enter the page title",
            validate: function (value) {
                if(!value.match(/\w+/)) {
                    return false;
                    done("page name must be characters");
                }
                return true;
            }
        }, {
            type: "confirm",
            name: "isNeedBizLogic",
            message: "Do you need biz logic?"
        }, {
            type: "confirm",
            name: "isNeedMockData",
            message: "Do you need mock data?"
        }];
        if(!this.options['testCase']) {
            this.prompt(prompt).then(function(answers) {
                this.answers = answers;
                done();
            }.bind(this));
        } else {
            this.answers = {
                isNeedBizLogic: true,
                platform: "webapp",
                projectPath: "testCaseBiz",
                pageName: "testPage"
            };
            done();
        }
    }

    writing() {
        this._writeLocalAndReleaseConf();
        this._writePageConfig();
        if(!this.pageExist) {
            this.answers.isNeedBizLogic && this._writingLogicFile();
            this._writeAssetsAndView();
            this._writeLocalAndReleaseConf();
            if(this.answers.isNeedMockData) {
                this.composeWith("@didi/octopus-structure:mock");
            }
        }
    }

    _writingLogicFile() {
        var path = "biz/logic/" + this.answers.projectPath + "/" + this.answers.pageName;
        this.fs.copyTpl(
            this.templatePath("_bizLogicJS.js"),
            this.destinationPath(path + "/" + this.answers.pageName + ".js"),
            {
                pageName: this.answers.pageName
            }
        );

        this.fs.copy(
            this.templatePath("_bizLogicCss.less"),
            this.destinationPath(path + "/" + this.answers.pageName + ".less")
        );

        this.fs.copy(
            this.templatePath("_bizConf.json"),
            this.destinationPath("biz/webpackConfig/" + this.answers.projectPath.replace("/", "-") + ".json"),
            {
                pageName: this.answers.pageName
            }
        );
        this.log(chalk.green("write logic files success"));
    }

    _writePageConfig() {
        var done = this.async();
        var currentConfPath = this.destinationPath("config/pageList/" + this.answers.platform + ".json");
        var currentConf = this.fs.readJSON(currentConfPath);
        var projectPath = this.answers.projectPath;
        var pageName = this.answers.pageName;
        if(currentConf[projectPath]) {
            var currentPageList = currentConf[projectPath];
            if(_.indexOf(currentPageList, pageName) > -1) {
                this.pageExist = true;
                this.log(chalk.red("this page has been exist!"));
            } else {
                currentPageList.push(pageName);
                this.fs.writeJSON(currentConfPath, currentConf);
                done();
                this.log(chalk.green("write page config success"))            }
        } else {
            currentConf[projectPath] = [pageName];
            this.fs.writeJSON(currentConfPath, currentConf);
            done();
            this.log(chalk.green("write page config success"))         }
    }

    _writeAssetsAndView() {
        this.fs.copyTpl(
            this.templatePath("_pageView.html"),
            this.destinationPath("page/" + this.answers.platform + "/" + this.answers.projectPath + "/" + this.answers.pageName + "/" + this.answers.pageName + ".html"),
            {
                pageTitle: this.answers.pageTitle
            }
        );

        this.fs.copyTpl(
            this.templatePath("_pageCss.less"),
            this.destinationPath("page/" + this.answers.platform + "/" + this.answers.projectPath + "/" + this.answers.pageName + "/" + this.answers.pageName + ".less")
        );

        this.fs.copyTpl(
            this.templatePath("_pageJS.js"),
            this.destinationPath("page/" + this.answers.platform + "/" + this.answers.projectPath + "/" + this.answers.pageName+ "/" + this.answers.pageName + ".js"),
            {
                pageName: this.answers.pageName
            }
        )
    }

    _writeLocalAndReleaseConf() {
        var defaultLocalConf = this.fs.readJSON(this.destinationPath("localConf.json"));
        defaultLocalConf.platform = this.answers.platform;
        defaultLocalConf.projectPath = this.answers.projectPath;
        defaultLocalConf.pageName = this.answers.pageName;
        this.fs.writeJSON(this.destinationPath("localConf.json"), defaultLocalConf);

        var defaultReleaseConf = this.fs.readJSON(this.destinationPath("releaseConf.json"));
        defaultReleaseConf.platform = this.answers.platform;
        defaultReleaseConf.projectPath = this.answers.projectPath;
        defaultReleaseConf.pageName = this.answers.pageName;
        this.fs.writeJSON(this.destinationPath("releaseConf.json"), defaultReleaseConf);
    }

    end() {
        var platform = this.answers.platform,
            projectPath = this.answers.projectPath,
            pageName = this.answers.pageName;
        this.log(chalk.green("now you can run 'npm start' and open browser to enter http://localhost:7777/release/" + platform + "-" + projectPath.replace("/", "-") + "/" + pageName + ".html to visit the page!"));
    }
};