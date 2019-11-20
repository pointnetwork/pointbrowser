const webpack = require('webpack');

export default (config, env, helpers) => {
	config.target = 'electron-renderer';
	if (env.production) {
		config.output.publicPath = env.pkg.homepage;
		let { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];
		plugin.definitions.PUBLIC_PATH = env.pkg.homepage;
	}

	// Helps mitigate this error:
	// Critical dependency: the request of a dependency is an expression
	// @ ./node_modules/encoding/lib/iconv-loader.js
	config.plugins.push(new webpack.IgnorePlugin(/\/iconv-loader$/));

	// Exclude node_modules so Babel doesn't try to optimize/compress it again
	let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
	rule.exclude = /node_modules/;
};
