/**
 * API ortam yapılandırması.
 * Projenizin ortamlarına göre baseUrl değerlerini düzenleyin.
 */

const ApiEnvironment = {
  Type: {
    local: "local",
    test: "test",
    localTest: "localTest",
    release: "release",
  } as const,

  // TODO: Projenizin API URL'lerini buraya ekleyin
  baseUrls: {
          local: "https://localhost:7001/api",
    test: "https://test.example.com/api",
    localTest: "http://10.34.60.1:5000/api",
    release: "https://api.example.com/api",
  } as Record<string, string>,
};

export type EnvironmentType =
  (typeof ApiEnvironment.Type)[keyof typeof ApiEnvironment.Type];

export default ApiEnvironment;
