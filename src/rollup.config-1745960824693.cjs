'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typescript = require('rollup-plugin-typescript2');
var path = require('path');

const clientConfig = {
  input: './client/index.ts',
  output: {
    file: path.resolve(__dirname, '../client_packages/client/client.js'),
    format: 'cjs',
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
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
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};

var rollup_config = [clientConfig, serverConfig];

exports.default = rollup_config;
