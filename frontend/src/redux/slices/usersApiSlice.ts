import { HttpMethods } from "../../models/httpMethods.enum";
import { AuthDataModel } from "../models/authData.model";
import { RegisterDataModel } from "../models/registerData.model";
import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data: AuthDataModel) => ({
        url: `${USERS_URL}/auth`,
        method: HttpMethods.Post,
        body: data,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: HttpMethods.Post,
      }),
    }),
    register: builder.mutation({
      query: (data: RegisterDataModel) => ({
        url: `${USERS_URL}`,
        method: HttpMethods.Post,
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data: RegisterDataModel) => ({
        url: `${USERS_URL}/profile`,
        method: HttpMethods.Update,
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
} = usersApiSlice;
