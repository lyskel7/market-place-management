import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { INTERNAL_BASE_URL } from '../constants/backend';
import type { IApiResponse } from '../interfaces';

export enum EHttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

type TAxiosError = {
  message: string;
  success: boolean;
};

export type TConfigInjector =
  | ((config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig)
  | undefined;

export type TInjectorMenu = 'token' | 'custome' | undefined;

class AxiosWrapper {
  private static wrapperInstance: AxiosWrapper;
  private axiosInstance: AxiosInstance;
  private static token: string;

  private static handleError(error: AxiosError) {
    const { response } = error;
    const errorData = (error.response?.data as TAxiosError).message;
    // console.error('Error data:', errorData);
    // console.error('Error response:', response);

    let errorMessage = 'An unexpected error occurred.';

    switch (response?.status) {
      case EHttpStatusCode.BAD_REQUEST:
        errorMessage = `Bad Request: ${errorData}`;
        break;
      case EHttpStatusCode.UNAUTHORIZED:
        errorMessage = `Unauthorized: ${errorData}`;
        // window.location.href = '/login';
        //Redirect to login page or show a modal
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
    return Promise.reject(new AxiosError(errorMessage, error.code));
  }

  private constructor(token?: string) {
    this.axiosInstance = axios.create({
      baseURL: INTERNAL_BASE_URL,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        // Manejo global de errores
        // console.error('API Error:', error);
        return AxiosWrapper.handleError(error);
      },
    );
  }

  // request<T, R = AxiosResponse<T>>(
  //   config: AxiosRequestConfig,
  // ): Promise<R> {
  //   return AxiosWrapper.request(config);
  // }
  public static getInstance(token?: string): AxiosWrapper {
    if (!AxiosWrapper.wrapperInstance) {
      AxiosWrapper.wrapperInstance = new AxiosWrapper(token);
      if (token) AxiosWrapper.token = token; // Opcional: guardar el token estáticamente si se necesita globalmente
    } else if (token && token !== AxiosWrapper.token) {
      // Opcional: si se pasa un token diferente, ¿re-inicializar o actualizar?
      // Por simplicidad, podrías decidir ignorar nuevos tokens o actualizar el existente
      AxiosWrapper.token = token;
      // Podrías querer actualizar el interceptor si el token cambia dinámicamente
      // Esto requeriría quitar el interceptor antiguo y añadir uno nuevo o tener una referencia
      // para actualizar el token dentro del interceptor existente.
      // Por ahora, asumamos que el token se establece una vez o se maneja estáticamente.
      console.warn('AxiosWrapper already initialized. Handling new token...');
      // Actualizar el token para futuras instancias (si es necesario)
      // OJO: Esto NO actualiza el token en el interceptor de la instancia YA creada
      // sin lógica adicional.
    }
    return AxiosWrapper.wrapperInstance;
  }

  public async get<TResponse = unknown>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<IApiResponse<TResponse>> {
    const resp = await this.axiosInstance.get<IApiResponse<TResponse>>(url, {
      params,
    });
    return resp.data;
  }

  public async post<TRequest, TResponse = unknown>(
    url: string,
    data: TRequest,
  ): Promise<IApiResponse<TResponse>> {
    const res = await this.axiosInstance.post<IApiResponse<TResponse>>(
      url,
      data,
    );
    return res.data;
  }

  public async patch<T>(url: string, data: T): Promise<boolean> {
    const { success } = await this.axiosInstance.patch<T, IApiResponse<never>>(
      url,
      data,
    );
    return success;
  }

  public async delete<T extends string>(url: T): Promise<boolean> {
    const { success } = await this.axiosInstance.delete<T, IApiResponse<never>>(
      url,
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
}

export default AxiosWrapper;
