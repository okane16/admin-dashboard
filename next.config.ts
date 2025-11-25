export default {
  serverExternalPackages: [
    '@confluentinc/kafka-javascript',
    '@514labs/moose-lib'
  ],
  transpilePackages: [],
  // Don't transpile files in dist/ - they're already compiled with schema injection
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      // Mark dist files as external to prevent recompilation
      config.resolve.alias = {
        ...config.resolve.alias
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      }
    ]
  }
};
