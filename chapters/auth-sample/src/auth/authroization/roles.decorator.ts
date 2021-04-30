import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/user/user";

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);