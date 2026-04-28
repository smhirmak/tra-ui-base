import ApiEnvironment from '@/constants/ApiEnvironment';

const Environment = {
  getEnvironment: () => {
    if (typeof window === 'undefined') {
      return process.env.NODE_ENV === 'development'
        ? ApiEnvironment.Type.local
        : ApiEnvironment.Type.Release;
    }

    const { host } = window.location;

    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return ApiEnvironment.Type.local;
    }
    if (host.includes('test')) {
      return ApiEnvironment.Type.test;
    }
    if (host.includes('ngrok')) {
      return ApiEnvironment.Type.local;
    }
    if (host.includes('10.34.60.')) {
      return ApiEnvironment.Type.localTest;
    }
    return ApiEnvironment.Type.Release;
  },

  getBaseUrl: () => {
    const env = Environment.getEnvironment();
    return ApiEnvironment.baseUrls[env] ?? '/api';
  },

  isLocal: () => Environment.getEnvironment() === ApiEnvironment.Type.local,
  isRelease: () => Environment.getEnvironment() === ApiEnvironment.Type.Release,
};

export default Environment;
