'use strict';

// const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// As we will exports both module and js build, start a base configuration
const baseConfig = {
	mode: 'production',

	// plugins:[
	// 	new ESLintPlugin( { overrideConfigFile: './config/codestyle/.eslintrc', })
	// ],

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				test: /\.js(\?.*)?$/i,

				// only minimize .min.js files
				include: /\.min\.js$/,
				extractComments: 'some'
			}),
		],
	},

	//Dont include three
	externals: {
		three: 'three',
	},

};


const moduleConfig = {
	target: 'node',

	// 2 files, raw + min
	entry: {
		'/three-bmfont-text.module': './src/index.js',
		'/three-bmfont-text.module.min': './src/index.js',
	},

	// as this configuration use `output.library.type='module'`
	experiments: {
		outputModule: true,
	},

	output: {
		filename: '[name].js', // force .js instead of .mjs
		chunkFormat: 'module',
		library: {
			type: 'module',
		},
	},

	...baseConfig
};

const browserConfig = {
	entry: {
		'/three-bmfont-text': './src/index.js',
		'/three-bmfont-text.min': './src/index.js',
	},
	output: {
		filename: '[name].js', // force .js instead of .mjs
		library: {
			type: 'commonjs',
		},
	},

	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						['@babel/preset-env']
					]
				}
			}
		}]
	},

	...baseConfig
};

// Export both module and browser config ( ... browser is wrongly named )
module.exports = [moduleConfig, browserConfig];