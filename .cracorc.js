const CracoLessPlugin = require("craco-less");
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/libs": path.resolve(__dirname, "./src/libs"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/mixins": path.resolve(__dirname, "./src/mixins"),
      "@/stores": path.resolve(__dirname, "./src/stores"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
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
