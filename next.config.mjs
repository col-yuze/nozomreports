/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handle font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|otf)$/i,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next",
          name: "static/fonts/[name].[hash].[ext]",
        },
      },
    });

    // Add any other loaders or webpack configurations here as needed

    return config;
  },
};

export default nextConfig;
