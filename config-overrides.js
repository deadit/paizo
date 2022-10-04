const addLessLoader = require("customize-cra-less-loader");
const path = require("path");

module.exports = function override(config) {
  config = addLessLoader({
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: { "@primary-color": "#20b564" },
        javascriptEnabled: true,
      },
    },
    modifyLessRule: (lessRule) => {
      lessRule.use = lessRule.use.map((item) => {
        return !(item.loader || "").includes("resolve-url-loader")
          ? item
          : {
              ...item,
              options: { ...item.options, root: path.resolve(__dirname) },
            };
      });
      return lessRule;
    },
  })(config);

  return config;
};
