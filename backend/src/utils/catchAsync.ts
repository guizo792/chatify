import { Request, Response } from 'express';

module.exports = (fn) => {
  return (req: Request, res: Response, next: Function) => {
    fn(req, res, next).catch(next);
  };
};
