// Metro configuration for Expo - ensure TypeScript extensions are resolved
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Ensure .ts and .tsx are included (dedupe to be safe)
const exts = new Set(config.resolver.sourceExts || []);
exts.add('ts');
exts.add('tsx');
config.resolver.sourceExts = Array.from(exts);

module.exports = config;

