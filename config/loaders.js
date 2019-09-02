const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers');

const typedCssModuleLoader = require.resolve(
  '../lib/typed-css-modules-loader'
);

const getScriptsLoader = () => ({
  test: /\.(jsx?|tsx?)$/,
  use: {
    loader: 'babel-loader',
    options: { cacheDirectory: true },
  },
  include: [
    helpers.resolvePath('src/client'),
    helpers.resolvePath('src/shared'),
  ],
});

const getStylesLoaders = isProduction => {
  const CSS_MODULE_REGEX = /\.module\.p?css$/;
  const CSS_REGEX = /\.p?css$/;

  const getLoaders = (isProduction, cssLoaderOptions, isCssModule = false) =>
    isProduction
      ? [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '/',
          },
        },
        {
          loader: 'css-loader',
          options: cssLoaderOptions,
        },
        {
          loader: 'postcss-loader',
          ident: 'postcss',
        },
      ]
      : [
        'style-loader',
        isCssModule && typedCssModuleLoader,
        {
          loader: 'css-loader',
          options: cssLoaderOptions,
        },
        {
          loader: 'postcss-loader',
          ident: 'postcss',
        },
      ].filter(Boolean);

  return [
    {
      test: CSS_MODULE_REGEX,
      use: getLoaders(
        isProduction,
        {
          importLoaders: 1,
          modules: {
            ...(!isProduction && { localIdentName: '[path][name]__[local]' }),
          },
          localsConvention: 'dashesOnly',
        },
        true
      ),
    },
    {
      test: CSS_REGEX,
      exclude: CSS_MODULE_REGEX,
      use: getLoaders(isProduction, {
        importLoaders: 1,
      }),
    },
  ];
};

const getImagesLoader = (isProduction, folder = '') =>
  isProduction
    ? {
      test: /\.(jpe?g|png|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: { name: `${folder}/media/[name].[hash:8].[ext]` },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            },
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
          },
        },
      ],
    }
    : {
      test: /\.(jpe?g|png|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: `${folder}/media/[name].[hash:8].[ext]`,
        },
      },
    };

const getSVGLoader = (isProduction, folder = '') =>
  isProduction
    ? {
      test: /\.(svg)$/,
      use: [
        {
          loader: 'svg-sprite-loader',
          options: { name: `${folder}/media/[name].[hash:8].[ext]` },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            svgo: {
              plugins: [
                { removeViewBox: false },
                { removeEmptyAttrs: false },
                { removeUselessStrokeAndFill: false },
              ],
            },
          },
        },
      ],
    }
    : {
      test: /\.(svg)$/,
      use: {
        loader: 'svg-sprite-loader',
        options: {
          name: `${folder}/media/[name].[hash:8].[ext]`,
        },
      },
    };

const getFontsLoaders = folder => {
  const getFontEotLoader = folder => ({
    test: /.(eot)$/,
    use: {
      loader: 'file-loader',
      options: {
        mimetype: 'application/vnd.ms-fontobject',
        name: `${folder}/media/[name].[hash:8].[ext]`,
      },
    },
  });

  const getFontWoffLoader = folder => ({
    test: /.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: {
      loader: 'file-loader',
      options: {
        mimetype: 'application/font-woff',
        name: `${folder}/media/[name].[hash:8].[ext]`,
      },
    },
  });

  const getFontTtfLoader = folder => ({
    test: /.(ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: {
      loader: 'file-loader',
      options: {
        mimetype: 'application/octet-stream',
        name: `${folder}/media/[name].[hash:8].[ext]`,
      },
    },
  });

  return [
    getFontEotLoader(folder),
    getFontTtfLoader(folder),
    getFontWoffLoader(folder),
  ];
};

const getLoaders = ({ folder } = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return [
    getScriptsLoader(),
    ...getStylesLoaders(isProduction),
    getImagesLoader(isProduction, folder),
    getSVGLoader(isProduction, folder),
    ...getFontsLoaders(folder),
  ];
};

module.exports = {
  getLoaders,
};
