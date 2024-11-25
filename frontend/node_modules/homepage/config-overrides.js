const path = require('path');

module.exports = function override(config, env) {
    // Add fallbacks for Node.js core modules
    config.resolve = {
        ...config.resolve,
        fallback: {
            "path": require.resolve("path-browserify"),
            "http": require.resolve("stream-http"),
            "net": require.resolve("net-browserify"),
            "fs": require.resolve("browserify-fs"),
            "querystring": require.resolve("querystring-es3"),
            "crypto": require.resolve("crypto-browserify"), // Add crypto fallback
            // Add other fallbacks if needed
        }
    };

    return config;
};