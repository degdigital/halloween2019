module.exports = {
    plugins: dest => [
        {
            name: '@deg-skeletor/plugin-copy',
            config: {
                directories: [{
                    src: 'source/html',
                    dest
                }]
            }
        }
    ]
};