import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  private readonly allowHeaders: string = '';
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = ['http://localhost:8080'];
    if (allowedOrigins.includes(req.header('Origin'))) {
      res.header('Access-Control-Allow-Origin', req.header('Origin'));
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
      res.header('Access-Control-Allow-Headers', this.allowHeaders);
    }

    // preflight 설정
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  }
}
