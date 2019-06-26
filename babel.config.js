const plugins = ['@babel/plugin-syntax-class-properties'];

const presets = [
    [
        '@babel/env',
        {
            targets: {
                node: 'current',
            },
        },
    ],
];

module.exports = {
    plugins,
    presets,
};
