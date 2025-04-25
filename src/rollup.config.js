import typescript from 'rollup-plugin-typescript2';
import path from 'path';

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

export default [clientConfig, serverConfig];