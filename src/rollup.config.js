import typescript from 'rollup-plugin-typescript2';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
    typescript({
      tsconfig: 'server/tsconfig.json',
      include: ['server/**/*.ts', 'shared/**/*.ts'],
      exclude: ['client/**/*.ts']
    }),
  ],
};

export default [clientConfig, serverConfig];