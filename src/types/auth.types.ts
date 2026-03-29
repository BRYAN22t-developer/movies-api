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

export interface AuthRepositoryContract {
  createUser(data: {
    username: string;
    password: string;
  }): Promise<ServiceResult<{ id: number }>>;
  findUserByUsername(username: string): Promise<UserAuthRecord | null>;
  assignRoleToUser(userId: number, roleId: number): Promise<void>;
  getRoleIdByName(name: string): Promise<number | null>;
  permissionIsAllowed(data: PermissionIsAllowedData): Promise<boolean>;
}

export interface AuthServiceContract {
  register(data: RegisterData): Promise<ServiceResult<{ id: number }>>;
  login(
    data: LoginData,
  ): Promise<ServiceResult<{ id: number; message: string }>>;
  getRoleIdByName(name: string): Promise<number | null>;
  permissionIsAllowed(data: PermissionIsAllowedData): Promise<boolean>;
}

export interface AuthControllerContract {
  register(req: Request, res: Response): Promise<Response | void>;
  login(req: Request, res: Response): Promise<Response | void>;
}

export interface AuthenticatorContract {
  authentication: (req: Request, res: Response, next: NextFunction) => void;

  authorization: (
    req: Request,
    res: Response,
    next: NextFunction,
    permission: string,
  ) => void;
}
