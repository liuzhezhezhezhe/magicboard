const CracoLessPlugin = require("craco-less");
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/api": path.resolve(__dirname, "./src/api"),
      "@/store": path.resolve(__dirname, "./src/store"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
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
              "@primary-color": "#1890ff",
              "@link-color": "#1890ff",
              "@border-radius-base": "10px",
              "@font-size-base": "16px"
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
