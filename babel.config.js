module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [['react-native-reanimated/plugin'],[
    'module:react-native-dotenv',
    {
      envName: 'APP_ENV',
      moduleName: '@env',
      path: '.env',

    },
  ],
  [
    'module-resolver',
    {
      alias: {
        '@assests': './src/assests',
        '@components': './src/components',
        '@context': './src/context',
        '@models': './src/models',
        '@viewmodel': './src/viewmodel',
        '@routes': './src/routes',
        '@screens': './src/screens',
        '@services': './src/services',
      },
    },
  ],]
};
