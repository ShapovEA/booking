import { UserModel } from "src/users/user.model";

export type JwtPayload = Pick<UserModel, "email"> & Pick<UserModel, "roles"> & { id: string };