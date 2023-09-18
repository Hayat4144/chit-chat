import { JwtPayload } from 'jsonwebtoken';
// Define custom properties for Request object
declare global {
  namespace Express {
    interface Request {
      user_id: string;
      email: string;
      name: string;
    }
  }
}

export interface payload extends JwtPayload {
  email: string;
  name: string;
  id: string;
  created_at?: Date;
}

export enum httpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
