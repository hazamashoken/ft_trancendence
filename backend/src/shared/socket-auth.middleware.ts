import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from "express";
import { Socket } from "socket.io"
import { SocketAuthGuard } from './socket-auth.guard';

export type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void)
}
export const SocketAuthMiddleware = (): SocketIOMiddleWare => {
  return (client, next) => {
    try {
      console.log('Socket Guard')
      SocketAuthGuard.validateClient(client);
      next();
    } catch (err) {
      next(err);
    }
  }
}


