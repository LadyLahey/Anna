module.exports = function(api) {
  api.cache(true);
  return {
    presents: ['babel-prezent-expo'],
    plugins:['react-native-reanimated/plugin'],
  };
};


