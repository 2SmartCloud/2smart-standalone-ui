
const path              = require('path');
const fs                = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    require    : [
        resolveApp('styleguide/setup.js'),
        path.join(__dirname, 'public/static/normalize.css'),
        path.join(__dirname, 'src/utils/theme/index.js')
    ],
    template: {
        head:{
            links: [{
                stylesheet: 'public/static/normalize.css'
            }]
        },
        body: {
            scripts: [{
                src: 'public/static/config.js'
            } ]
        }
    },
    components : 'src/components/base/**/[A-Z]*.js',
    skipComponentsWithoutExample: true,
    ignore:['src/components/base/icons/[A-Z]*.js'],
    styleguideComponents: {
        TableOfContentsRenderer: path.join(
            __dirname,
            'styleguide/components/TableOfContents'
        ),
        Preview: path.join(
            __dirname,
            'styleguide/components/Preview'
        ),
        StyleGuideRenderer: path.join(
            __dirname,
            'styleguide/components/StyleGuide'
        ),
    },
    styles:{
        Editor: {
            root:{
                'font-family': "'Helvetica Neue', sans-serif;"
            }           
        }
    },
    sections: [
        {
            name:'Base components',
            components: 'src/components/base/[A-Z]*.js',
            section:[]
        },
        {
            name: 'Inputs',
            components: 'src/components/base/inputs/*.js',
            sections:[]
        },
        {
            name: 'Selects',
            components: 'src/components/base/select/*.js',
            sections:[],
        },
        {
            name: 'Controls',
            components: 'src/components/base/controls/*.js',
            sections:[] 
        },
        {
            name: 'Modals',
            components: 'src/components/base/modals/**/*.js',
            sections:[],
        } ,
        {
            name: 'Nothing to show notifications',
            components: 'src/components/base/nothingToShowNotification/*.js',
            sections:[],
        },
        {
            name: 'Sidebar',
            components: [
                'src/components/base/sidebar/ScreenListItem.js',
                'src/components/base/sidebar/ScreenList.js'],
            sections:[],
        }
    ] 
};

