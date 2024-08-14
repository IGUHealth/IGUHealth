import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import typescript from "@rollup/plugin-typescript";

export default {
   input: 'src/index.tsx',
   output: {
      file: 'public/bundle.js',
      format: 'iife'
   },
   plugins: [
      nodeResolve({
         extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__", "**/*.test.ts"],
      }),
      babel({
         babelHelpers: 'bundled',
         presets: ['@babel/preset-react'],
         extensions: ['.js', '.jsx', '.tsx', '.ts']
      }),
      commonjs(),
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': '"development"'
      })
   ]
}