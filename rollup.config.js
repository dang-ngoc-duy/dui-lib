import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from "rollup-plugin-postcss";
import visualizer from 'rollup-plugin-visualizer';
//import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
//import { getFiles } from './scripts/buildUtils.tsx';

const packageJson = require("./package.json");
const extensions = ['.js', '.ts', '.jsx', '.tsx'];

export default [
	{
		input: [
			'./src/index.ts',
			// ...getFiles('./src/components', extensions),
			// ...getFiles('./src/types', extensions),
			// ...getFiles('./src/utils', extensions),
		],
		output: [
			{      
				dir: 'dist',
				format: 'esm',
				preserveModules: true,
				preserveModulesRoot: 'src',
				sourcemap: true,
			},
		],
		plugins: [
			resolve(),
			commonjs(),
			typescript({
			  tsconfig: './tsconfig.build.json',
			  declaration: true,
			  declarationDir: 'dist',
			}),
			postcss(),
			terser(),
			visualizer({
			  filename: 'bundle-analysis.html',
			  open: true,
			}),
		],
		external: [
			'react', 
			'@types/react',
			'@mui/material',
			'@mui/styles',
			'@mui/system',
			'clsx',
			'echarts',
			'echarts-for-react',
			'types/Components'
		],
	},
]