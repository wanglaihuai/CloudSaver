module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue({ file }) {
        return file.indexOf("vant") !== -1 ? 37.5 : 75;
      },
      propList: ["*"],
      exclude: (file) => {
        return !file.includes("mobile") && !file.includes("vant");
      },
    },
  },
};
