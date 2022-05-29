const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              "@primary-color": "#9254de",
              "@link-color": "#9254de",
              "@border-radius-base": "10px"
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
