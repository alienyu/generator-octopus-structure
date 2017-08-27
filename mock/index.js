'use strict';
const Generator = require('yeoman-generator');
const copydir = require('copy-dir');
const chalk = require("chalk");
const deasync = require("deasync");
const shell = require('child_process');
const yosay = require('yosay');
const _ = require("lodash");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.log(yosay(chalk.green("start build mock data")));
    }

    prompting() {
        var done = this.async();
        var prompt = [{
            type: "input",
            name: "projectPath",
            message: "Please enter your projectPath",
            validate: function (value) {
                if(!value.match(/\w+/)) {
                    return false;
                }
                return true;
            }
        },{
            type: "input",
            name: "pageName",
            message: "Please enter your pageName",
            validate: function (value) {
                if(!value.match(/\w+/)) {
                    return false;
                }
                return true;
            }
        },{
            type: "input",
            name: "ajaxUrl",
            message: "Please enter the ajax url",
            validate: function (value) {
                if(!value) {
                    return false;
                }
                return true;
            }
        },{
            type: "confirm",
            name: "isNeedSelfDefinedData",
            message: "write mapping list for your own defined mock data name",
            defaults: false
        }];
        var promptEnterDataName = [{
            type: "input",
            name: "dataName",
            message: "Please enter your own defined mock data file name"
        }];

        this.prompt(prompt).then(function(answers) {
            this.answers = answers;
            if(this.answers.isNeedSelfDefinedData) {
                this.prompt(promptEnterDataName).then(function(result) {
                    this.answers.dataName = result.dataName;
                    done();
                }.bind(this));
            } else {
                done();
            }
        }.bind(this));
    }

    writing() {
        this._writingMockData();
        if(this.answers.isNeedSelfDefinedData) {
            this._writingMappList();
        }
    }

    _writingMockData() {
        var dataName,
            projectPath = this.answers.projectPath,
            pageName = this.answers.pageName,
            ajaxUrl = this.answers.ajaxUrl;
        if(this.answers.isNeedSelfDefinedData) {
            dataName = this.answers.dataName;
        } else {
            dataName = ajaxUrl.substr(1).split("/").join("-");
        }
        this.fs.copy(
            this.templatePath("_mockData.json"),
            this.destinationPath("biz/mockData/" + projectPath + "/" + pageName + "/" + dataName + ".json")
        );
        this.log(chalk.green("create mock data success"));
    }

    _writingMappList() {
        var dataName = this.answers.dataName,
            projectPath = this.answers.projectPath,
            pageName = this.answers.pageName,
            ajaxUrl = this.answers.ajaxUrl;
        var done = this.async();
        var defaultMappingList = this.fs.readJSON(this.destinationPath("biz/mockData/mappingList.json"));
        var key = ajaxUrl;
        var wholeDataName = "./biz/mockData/" + projectPath + "/" + pageName + "/" + dataName + ".json";
        if(defaultMappingList[key]) {
            this.log(chalk.red("this mock info has been exist!"));
            done("error");
        } else {
            defaultMappingList[key] = wholeDataName;
        }
        this.fs.writeJSON(this.destinationPath("biz/mockData/mappingList.json"), defaultMappingList);
        done();
        this.log(chalk.green("write mapping list success"));
    }
};