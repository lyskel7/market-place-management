// import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
// import AxiosWrapper, { TConfigInjector, TInjectorMenu } from "./AxiosWrapper";

// export class ServiceWrapper {
//   protected _axiosInstance: AxiosInstance;

//   protected constructor(injectorMenu: TInjectorMenu) {
//     let injectConfig: TConfigInjector;

//     switch (injectorMenu) {
//       case "token":
//         injectConfig = this.tokenConfigInjector;
//       case "custome":
//         injectConfig = this.customeConfigInjector;
//       default:
//         injectConfig = undefined;
//     }

//     this._axiosInstance = AxiosWrapper.getInstance(injectConfig).axiosInstance;
//   }

//   private tokenConfigInjector(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
//     try {
//       const token = localStorage.getItem("token");

//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       throw new Error(error as string);
//     }
//   }

//   private customeConfigInjector(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
//     // other config
//     return config;
//   }

// // public static getUserServiceInstance(injectorMenu: TInjectorMenu = undefined): UserService {
//   //   if (!UserService._userServiceInstance) {
//   //     UserService._userServiceInstance = new UserService(injectorMenu);
//   //   }
//   //   return UserService._userServiceInstance;
//   // }

// //   async fetchUsers(): Promise<TUser[]> {
// //     const response = await this._axiosInstance.get<TUser[]>("api/users");
// //     return response.data;
// //   };

// //   async getUserById(user: TUser): Promise<TUser> {
// //     const response = await this._axiosInstance.get<TUser>(`/users/${user.id}`);
// //     return response.data;
// //   };

// //   async createUser(user: TUser): Promise<TUser> {
// //     const response = await this._axiosInstance.post<TUser>("/users", user);
// //     return response.data;
// //   };

// //   async updateUser(user: TUser): Promise<TUser> {
// //     const response = await this._axiosInstance.put<TUser>(`/users/${user.id}`, user);
// //     return response.data;
// //   };

// //   async deleteUser(user: TUser): Promise<TUser> {
// //     const response = await this._axiosInstance.delete<TUser>(`/users/${user.id}`);
// //     return response.data;
// //   };
// }

// export default ServiceWrapper;
