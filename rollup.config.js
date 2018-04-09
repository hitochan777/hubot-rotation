// @format
//
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  plugins: [typescript(/*{ plugin options }*/)],
};
