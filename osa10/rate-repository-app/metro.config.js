// eslint-disable-next-line no-undef
const { getDefaultConfig } = require('expo/metro-config');

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

// eslint-disable-next-line no-undef
module.exports = config;
