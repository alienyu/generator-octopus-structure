const Generator = require('yeoman-generator');
const copydir = require('copy-dir');
const chalk = require("chalk");
const yosay = require('yosay');
const _ = require("lodash");
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.log(yosay(chalk.green("start build octopus structure")));

        //whether skip the npm install step
        this.option('skip-npm-install', {
            desc: 'Skip the npm install step',
            type: Boolean,
            defaults: false
        });
    }

    prompting() {
        var done = this.async();
        var testCasePrompt = [{
            type: "confirm",
            name: "isNeedTestCase",
            message: "Do you need to create test case?"
        }];
        this.prompt(testCasePrompt).then(function(answers) {
            this.answers = answers;
            done();
        }.bind(this));
    }

    writing() {
        this._writingFiles();
        this._writingDir();
        this._writingBuildConf();
    }

    _createSuccess(name) {
        this.log(chalk.green("   create " + name + " success"));
    }

    _syncDirWrite(dirList, i) {
        let dir = dirList[i];
        copydir(this.templatePath(dir), this.destinationPath(dir), function(){
            this._createSuccess(dir);
            if(++i < dirList.length) {
                this._syncDirWrite(dirList, i++);
            } else {
                if(this.answers.isNeedTestCase) {
                    this.composeWith("/octopus-structure:biz",
                        {
                            testCase: true
                        }
                    );
                }
            }
        }.bind(this));
    }

    _syncFileWrite(fileList, i) {
        let file = fileList[i];
        this.fs.copy(
            this.templatePath(file),
            this.destinationPath(file.replace("_", "")),
            {
                process: function(content) {
                    if(++i < fileList.length) {
                        this._syncFileWrite(fileList, i++);
                    } else {

                    }
                    return content;
                }.bind(this)
            }
        );
    }

    _writingDir() {
        var dirList = ["biz", "common", "config", "output", "page", "server"];
        this._syncDirWrite(dirList, 0);
    }

    _writingFiles() {
        var fileList = [".babelrc", ".npmignore", "app.js", "loadCommonConfig.js", "pageCategory.js", "releaseConf.json", "_localConf.json", "package.json"];
        this._syncFileWrite(fileList, 0);
    }

    _writingBuildConf() {
        this._writingWebpackConfig();
        this._writingWebpackReleaseConfig();
    }

    _writingWebpackConfig() {
        this.fs.copyTpl(
            this.templatePath("webpack.config.js"),
            this.destinationPath("webpack.config.js"),
            {
                platform: this.answers.platform
            }
        );
    }

    install() {
        if(!this.options['skip-npm-install']) {
            this.installDependencies({
                npm: true,
                bower: false
            });
        }
    }
};