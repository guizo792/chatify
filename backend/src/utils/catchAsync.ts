import { Request, Response } from 'express';

module.exports = (fn: Function) => {
  return (req: Request, res: Response, next: Function) => {
    fn(req, res, next).catch(next);
  };
};
