import type { Request, Response, NextFunction } from "express";

export type RegisterData = {
  username: string;
  password: string;
  role: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export type PermissionIsAllowedData = {
  userId: number;
  permission: string;
};

export type UserAuthRecord = {
  id: number;
  username: string;
  password: string;
};

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface AuthRepository {
  createUser(data: {
    username: string;
    password: string;
  }): Promise<ServiceResult<{ id: number }>>;
  findUserByUsername(username: string): Promise<UserAuthRecord | null>;
  getUserById(id: number): Promise<UserAuthRecord | null>;
  assignRoleToUser(userId: number, roleId: number): Promise<void>;
  getRoleIdByName(name: string): Promise<number | null>;
  permissionIsAllowed(data: PermissionIsAllowedData): Promise<boolean>;
  deleteUserById(userId: number): Promise<void>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
  updateUser(
    id: number,
    data: { username?: string; password?: string },
  ): Promise<void>;
  getusersWithRole(roleName: string): Promise<UserAuthRecord[]>;
}

export interface AuthService {
  register(data: RegisterData): Promise<ServiceResult<{ id: number }>>;
  login(
    data: LoginData,
  ): Promise<ServiceResult<{ id: number; message: string }>>;
  getUserById(id: number): Promise<UserAuthRecord | null>;
  getRoleIdByName(name: string): Promise<number | null>;
  permissionIsAllowed(data: PermissionIsAllowedData): Promise<boolean>;
  deleteUserById(userId: number): Promise<void>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
  updateUser(
    id: number,
    data: { username?: string; password?: string },
  ): Promise<void>;
  getusersWithRole(roleName: string): Promise<UserAuthRecord[]>;
}

export interface AuthController {
  register(req: Request, res: Response): Promise<Response | void>;
  login(req: Request, res: Response): Promise<Response | void>;
  getUser(req: Request, res: Response): Promise<Response | void>;
  deleteUser(req: Request, res: Response): Promise<Response | void>;
  updatePassword(req: Request, res: Response): Promise<Response | void>;
  updateUser(req: Request, res: Response): Promise<Response | void>;
  getUsersWithRole(req: Request, res: Response): Promise<Response | void>;
}

export interface Authenticator {
  authentication: (req: Request, res: Response, next: NextFunction) => void;

  authorization: (
    req: Request,
    res: Response,
    next: NextFunction,
    permission: string,
  ) => void;
}
