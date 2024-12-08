import { UserContextT } from "@/utils/user-context";

import { Endpoint } from "./endpoint";

type UserRegisterT = {
  message: string;
  user: UserDataT;
  token: string;
};
type UserLoginT = {
  message: string;
  user: UserDataT;
  token: string;
};
export type UserT = {
  id: string;
  name: string;
  profileUrl: string;
};
export type UserDataT = {
  email: string;
  id: number;
  username: string;
};

export default class User {
  data: UserDataT;
  token: string;
  constructor(data: UserDataT, token: string) {
    this.data = data;
    this.token = token;
  }

  static login(payload: { email: string; password: string }): Promise<User> {
    return Endpoint.request<UserLoginT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}login`,
      data: payload,
    }).then((resp) => {
      localStorage.setItem("smart-farm-token", resp.data.token);

      return new User(resp.data.user, resp.data.token);
    });
  }

  static register(payload: {
    email: string;
    password: string;
    username: string;
  }): Promise<User> {
    return Endpoint.request<UserRegisterT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}register`,
      data: payload,
    }).then((resp) => {
      localStorage.setItem("smart-farm-token", resp.data.token);

      return new User(resp.data.user, resp.data.token);
    });
  }

  static getUser(payload: { token: string }): Promise<User> {
    if (!payload.token) {
      return Promise.reject("No token provided");
    }

    return Endpoint.request<UserLoginT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}users`,
      headers: {
        Authorization: `Bearer ${payload.token}`,
      },
    }).then((resp) => {
      return new User(resp.data.user, payload.token);
    });
  }
  static logout(user: UserContextT["user"]): Promise<void> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}auth/logout`,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }).then(() => {
      localStorage.removeItem("smart-farm-token");
    });
  }
}
