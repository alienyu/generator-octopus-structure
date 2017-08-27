'use strict';
const Generator = require('yeoman-generator');
module.exports = class extends Generator {    // The name `constructor` is important here
    constructor(args, opts) {
        super(args, opts);

        this.option('skip-welcome-message', {
            desc: 'Skips the welcome message',
            type: Boolean
        });

        this.option('skip-install-message', {
            desc: 'Skips the message after the installation of dependencies',
            type: Boolean
        });

        this.option('test-framework', {
            desc: 'Test framework to be invoked',
            type: String,
            defaults: 'mocha'
        });

        this.option('babel', {
            desc: 'Use Babel',
            type: Boolean,
            defaults: true
        });
    }

    method1() {
        console.log('sub 1 just ran');
    }

    method2() {
        console.log('sub 2 just ran');
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('html/index.html'),
            this.destinationPath('views/a.html'),
            {
                htmlContent: "fgdg43tgdhg"
            }
        )
    }
}