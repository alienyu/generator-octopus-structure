'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const _ = require("lodash");
/*
    执行顺序：constructor=>initializing=>prompting=>configuring=>default=>writing=>conflicts=>install=>end
*/
module.exports = class extends Generator {    // The name `constructor` is important here
    constructor(args, opts) {
        super(args, opts);

        /*
            命令行参数 yo octopus-structure my-project,接受键值对的条件
             desc：描述argument
             required：定义是否必须
             optional：是否可选择的
             type：参数类型,支持的类型有String Number Array Object
             defaults： argument默认值
             banner：字符串显示的使用说明（这是默认提供）
         */
        this.argument('appname', {
            type: String,
            required: true
        });

        /*
            给命令行参数skip-welcome-message设置默认值和描述： yo octopus-structure --skip-welcome-message
         */
        this.option('skip-welcome-message', {
            desc: 'Skips the welcome message',
            type: Boolean
        });
    }
    prompting() {
        if (!this.options['skip-welcome-message']) {
            this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile to build your app.'));
        }
    }
    writing() {
        this.fs.copy(
            this.templatePath('package.json'),
            this.destinationPath('package.json')
        )
    }

    install() {
        /*安装各类加载器的包
             this.installDependencies({
                 npm: true
             });
        */
        //只安装npm包
        this.npmInstall();
        // this.npmInstall(['lodash], {'saveDev': true})

    }
}