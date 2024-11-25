const path = require('path');

module.exports = {
    // Your existing Webpack configuration...
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "querystring": require.resolve("querystring-es3"),
            "url": require.resolve("url"),
            "zlib": require.resolve("browserify-zlib"),
            "path": require.resolve("path-browserify"),
            "http": require.resolve("stream-http"),
            "net": require.resolve("net-browserify"),
            "fs": false,
            "net": false,
            "http": false,
            "https": false,
            "os": false,
            "tls": false,
            "dgram": false,
            "child_process": false
        }

    }
};