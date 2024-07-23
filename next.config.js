module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8081',
          pathname: '/wordpress/wp-content/uploads/**',
        },
      ],
    },
  }