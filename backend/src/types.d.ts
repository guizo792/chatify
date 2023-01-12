declare namespace Express {
  export interface Request {
    user: any;
    originalUrl: string;
  }
  export interface Response {
    user: any;
  }
}
