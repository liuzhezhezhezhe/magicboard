const CracoLessPlugin = require("craco-less");
const path = require("path");
const { DefinePlugin } = require("webpack");

const config = require("dotenv").config({
  path: path.resolve(__dirname, "./.env." + process.env.NODE_ENV)
});


module.exports = {
  webpack: {
    alias: {
      "@/apis": path.resolve(__dirname, "./src/apis"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/libs": path.resolve(__dirname, "./src/libs"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/mixins": path.resolve(__dirname, "./src/mixins"),
      "@/stores": path.resolve(__dirname, "./src/stores"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
    },
    plugins: {
      add: [
        new DefinePlugin({
          BASE_URL: JSON.stringify(config.parsed.BASE_URL)
        })
      ]
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.externals = {
        fabric: "fabric",
      };
      return webpackConfig;
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@border-radius-base": "7px",
              "@font-size-base": "17px"
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
