// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

let isProduction = process.env.NODE_ENV == "production";

function config() {
  return {
	resolve: { alias: { vue: 'vue/dist/vue.esm.js' } },
	entry: {
	  "/js/index.js": "./resources/js/index.js",
	  "/css/index.css": "./resources/scss/index.scss",
	},
	output: {
	  filename: 'dist/[name]',
	  path: path.resolve(__dirname),
	  sourceMapFilename: '[name].[hash:8].map',
	  chunkFilename: '[id].[hash:8].js',
	  publicPath: '../../'
	},
	plugins: [
	  new VueLoaderPlugin(),
	  new MiniCssExtractPlugin({
		filename: './public/[name]',
	  }),
	  new FileManagerPlugin({
		events: {
		  onEnd: {
			  /*delete: [
				'public/js'
			  ],*/
			  copy: [
				  {source: 'dist/js', destination: 'public/js'},
				  //{source: 'node_modules/flag-icon-css/flags', destination: 'public/images/flags'},
			  ]
		  }
		}
	})
	  // Add your plugins here
	  // Learn more about plugins from https://webpack.js.org/configuration/plugins/
	],
	module: {

	  rules: [
		{
		  test: /\.vue$/,
		  loader: 'vue-loader',
		  options: {
			transformAssetUrls: {
			  video: ['src', 'poster'],
			  source: 'src',
			  img: 'src',
			  image: ['xlink:href', 'href'],
			  use: ['xlink:href', 'href']
			}
		  }
		},
		{
		  test: /\.(js|jsx)$/i,
		  use: [

			{
			  loader: "babel-loader",
			  options: {
				filename: "/public/[name]",

			  }
			},
		  ]
		},
		{
		  test: /\.s[ac]ss$/i,
		  use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
		},
		{

		  test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
		  use: [
			{
			  loader: 'file-loader',
			  options: {
				hash: "sha512",
				digest: "hex",
				outputPath: "/public/images",
				name: "[hash].[ext]",
				publicPath: isProduction ? "/images" : "../images",
				esModule: false
			  }
			},
			{
			  loader: 'image-webpack-loader',
			  options: {
				bypassOnDebug: true,
				optimizationLevel: 7,
				interlaced: false
			  }
			}
		  ]
		},
		{
		  test: /\.pug$/,
		  //include: path.join(__dirname, 'resources/views'),
		  use: [
			"file-loader?name=/public/views/[name].html&esModule=false",
			"extract-loader",
			{
			  loader: "html-loader",
			  options: {
				sources: {//https://github.com/peerigon/extract-loader/issues/96
				  list: [
					{
					  tag: "img",
					  attribute: "src",
					  type: "src"
					}
				  ]
				},
				esModule: false
			  }
			},
			"pug-html-loader?esModule=false"
		  ],
		}

		// Add your rules for custom modules here
		// Learn more about loaders from https://webpack.js.org/loaders/
	  ],
	},
  };
}

module.exports = (env, argv) => {
  isProduction = argv.mode == "production";
  let conf = config();
  /*if (isProduction) {
	conf.mode = "production";

	conf.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
	conf.mode = "development";
  }*/
  conf.mode = "development";
  return conf;
};
