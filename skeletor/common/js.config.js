const path = require('path');

const rollupInputFiles = [
    'source/js/index.js'
];

const legacyBabelPresets = [
    [
        '@babel/preset-env',
        {
            modules: false,
            targets: '> 1%, ie 11'
        }
    ]
];

const modernBabelPresets = [
    [
        '@babel/preset-env',
        {
            modules: false,
            targets: 'Firefox >= 62, Edge >= 17, Chrome >= 69, iOS >= 11.4, ChromeAndroid >= 70'
        }
    ]
];

function rollupOutput(destPath, isModern) {
    return [
        {
            dir: isModern ? destPath : path.join(destPath, 'nomodule'),
            format: isModern ? "es" : "system"
        }
    ];
}

function rollupPlugins(isModern, minify) {
    const plugins = [
        require('rollup-plugin-replace')({
            ENVIRONMENT: () => JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.NODE_ENV': () => JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        require('rollup-plugin-babel')({
            include: [
                'source/js/**',
                'node_modules/@degjs/**'
            ],
            babelrc: false,
            plugins: [
                "@babel/plugin-transform-react-jsx", 
		        "@babel/plugin-proposal-class-properties"
            ],
            presets: isModern ? modernBabelPresets : legacyBabelPresets
        }),
        require('rollup-plugin-node-resolve')({
            browser: true
        }),
        require('rollup-plugin-commonjs')({
            include: 'node_modules/**',
            namedExports: {
                'node_modules/react/index.js': [
                    'Component', 
                    'PureComponent', 
                    'Fragment', 
                    'Children', 
                    'createElement', 
                    'cloneElement', 
                    'createContext'
                ],
                'node_modules/react-dom/index.js': [
                    'render'
                ]
            }
        })
    ];

    if(minify) {
        plugins.push(require('rollup-plugin-terser').terser());
    }

    return plugins;
}

module.exports = {
    rollupConfig: function(destPath, minify = false) {
        return [
            {
                input: rollupInputFiles,
                output: rollupOutput(destPath, true),
                plugins: rollupPlugins(true, minify),
                experimentalCodeSplitting: true
            },
            {
                input: rollupInputFiles,
                output: rollupOutput(destPath, false),
                plugins: rollupPlugins(false, minify),
                experimentalCodeSplitting: true
            }
        ]
    },
    copyConfig: function(destPath) {
        return {
            directories: [{
                src: 'node_modules/systemjs/dist/s.min.js',
                dest: path.join(destPath, '/systemjs')
            }]
        };
    }
};
