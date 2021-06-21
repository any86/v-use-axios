const typescript = require('rollup-plugin-typescript2');
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
            tsconfig: "./tsconfig.json",
            
        }),
        nodeResolve(),
        json(),
        replace({
            __VERSION__: version,
            preventAssignment: true,
        }),
    ],
    external: ['vue', 'axios'],
    output: [
        {
            format: 'es',
            file: `dist/index.es.js`,
            sourcemap: true,
        },

        {
            format: 'cjs',
            file: `dist/index.js`,
            exports: 'default',
            sourcemap: true,
        },
        {
            globals: { 'vue': 'Vue' },
            format: 'umd',
            name: 'useAxios',
            file: `dist/useAxios.umd.js`,
            sourcemap: true,
        }]
};