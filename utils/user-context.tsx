"use client";
import React from "react";

import User from "@/src/API/user";

type UserT = User | null | undefined;

export type UserContextT = {
  user: UserT;
  setUser: React.Dispatch<React.SetStateAction<UserT>>;
};

export const UserContext = React.createContext<UserContextT>({
  user: null,
  setUser: () => {},
});

export const useUserContext = () => React.useContext(UserContext);
