import "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    silentError?: boolean;
  }

  interface AxiosRequestConfig {
    silentError?: boolean;
  }
}
