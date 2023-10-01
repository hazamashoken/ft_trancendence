import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { XKeyGuard } from '@backend/shared/x-key.guard';

@Controller('auth')
@UseGuards(XKeyGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  oauthToken(@Query() query: any) {
    if (!query.access_token) {
      throw new BadRequestException('access_token is required');
    }
    return this.authService.verify(query.access_token);
  }
}
