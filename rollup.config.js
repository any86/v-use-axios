const typescript = require('@rollup/plugin-typescript');
import { nodeResolve } from '@rollup/plugin-node-resolve';
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
import { version } from './package.json';

export default {
    input: './src/index.ts',

    plugins: [
        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript'),
        }),
        nodeResolve(),
        json(),
        replace({
            __VERSION__: version,
            preventAssignment: true,
        }),
    ],
    external: ['vue', 'axios'],
    output: [{
        // globals: { 'any-scroll': 'AnyTouch',raf:'raf' },
        format: 'umd',
        name: 'vUseAxios',
        file: `index.js`,
        sourcemap: false,
    }]
};