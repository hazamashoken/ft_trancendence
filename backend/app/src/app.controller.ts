import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log('POSTGRES_USER: ', this.configService.get('POSTGRES_USER'));
    console.log('NESTJS_PORT: ', this.configService.get('NESTJS_PORT'));
    return this.appService.getHello();
  }
}
