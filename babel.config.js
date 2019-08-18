const plugins = ['@babel/plugin-proposal-class-properties'];

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
