import { UserModel } from "../../models/user.model";

export interface StateModel {
  auth: {
    userInfo: UserModel | null;
  };
}
