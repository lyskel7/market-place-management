import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { INTERNAL_BASE_URL } from '../constants/backend';
import { IBooleanResponse } from '../interfaces';

export enum EHttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

type TAxiosError = {
  error: string;
};

export type TConfigInjector =
  | ((config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig)
  | undefined;

export type TInjectorMenu = 'token' | 'custome' | undefined;

class AxiosWrapper {
  private static instance: AxiosInstance;
  private static token: string;

  private static handleError(error: AxiosError) {
    const { response } = error;
    const errorData = (error.response?.data as TAxiosError).error;

    let errorMessage = 'An unexpected error occurred.';

    switch (response?.status) {
      case EHttpStatusCode.BAD_REQUEST:
        errorMessage = `Bad Request: ${errorData}`;
        break;
      case EHttpStatusCode.UNAUTHORIZED:
        errorMessage = `Unauthorized: ${errorData}`;
        // window.location.href = '/login';
        // Redirigir a la página de inicio de sesión, por ejemplo
        break;
      case EHttpStatusCode.FORBIDDEN:
        errorMessage = `Forbidden: ${errorData}`;
        break;
      case EHttpStatusCode.NOT_FOUND:
        errorMessage = `Not Found: ${errorData}`;
        break;
      case EHttpStatusCode.INTERNAL_SERVER_ERROR:
        errorMessage = `Internal Server Error: ${errorData}`;
        break;
      default:
        errorMessage = `Unhandled error: Status ${response?.status}, Data: ${errorData}`;
        break;
    }
    return Promise.reject(new AxiosError(errorMessage));
  }

  public static getInstance(token = undefined): AxiosWrapper {
    if (!AxiosWrapper.instance) {
      AxiosWrapper.instance = axios.create({
        baseURL: INTERNAL_BASE_URL,
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      AxiosWrapper.instance.interceptors.request.use((config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      AxiosWrapper.instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => {
          // Manejo global de errores
          console.error('API Error:', error);
          return AxiosWrapper.handleError(error);
        },
      );
    }
    return AxiosWrapper.instance;
  }

  // request<T, R = AxiosResponse<T>>(
  //   config: AxiosRequestConfig,
  // ): Promise<R> {
  //   return AxiosWrapper.request(config);
  // }

  public async get<T, R = AxiosResponse<T>>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<R> {
    const resp = await AxiosWrapper.instance.get(url, { params });
    return resp.data;
  }

  public async post<T>(url: string, data: T): Promise<boolean> {
    const { success } = await AxiosWrapper.instance.post<T, IBooleanResponse>(
      url,
      data,
    );
    return success;
  }

  public async delete<T extends string>(url: T): Promise<boolean> {
    const { success } = await AxiosWrapper.instance.delete<T, IBooleanResponse>(
      url,
    );
    return success;
  }

  public async patch<T>(url: string, data: T): Promise<boolean> {
    const { success } = await AxiosWrapper.instance.patch<T, IBooleanResponse>(
      url,
      data,
    );
    return success;
  }
  // put<T = any, R = AxiosResponse<T>>(
  //   url: string,
  //   data?: T,
  //   config?: AxiosRequestConfig,
  // ): Promise<R> {
  //   return this._axiosInstance.put<T, R>(url, data, config);
  // }

  //Error posible:
  // instance.get('/data')
  // .then(response => {
  //   // Manejar la respuesta exitosa
  // })
  // .catch(error => {
  //   if (error.code === 'ECONNABORTED') {
  //     console.error('La petición ha excedido el tiempo de espera');
  //   } else {
  //     // Manejar otros tipos de errores
  //   }
  // });
}

export default AxiosWrapper;
