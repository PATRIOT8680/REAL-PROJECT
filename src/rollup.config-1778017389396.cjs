'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typescript = require('rollup-plugin-typescript2');
var path = require('path');
var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var json = require('@rollup/plugin-json');

const clientConfig = {
  input: './client/index.ts',
  output: {
    file: path.resolve(__dirname, '../client_packages/client/client.js'),
    format: 'cjs',
  },
  plugins: [
    resolve(), // Добавлено
    commonjs(), // Добавлено
    typescript({
      tsconfig: 'client/tsconfig.json', // Указываем конкретный tsconfig для клиента
      include: ['client/**/*.ts', 'shared/**/*.ts'],
      exclude: ['server/**/*.ts']
    }),
  ],
};

const serverConfig = {
  input: './server/index.ts',
  output: {
    file: path.resolve(__dirname, '../packages/core/server.js'),
    format: 'cjs',
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: 'server/tsconfig.json',
      include: ['server/**/*.ts', 'shared/**/*.ts'],
      exclude: ['client/**/*.ts']
    }),
  ],
};

var rollup_config = [clientConfig, serverConfig];

exports.default = rollup_config;
