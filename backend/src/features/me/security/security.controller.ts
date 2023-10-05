import { AuthGuard } from "@backend/shared/auth.guard";
import { XKeyGuard } from "@backend/shared/x-key.guard";
import { Controller, UseGuards, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SecurityService } from "./security.service";

@Controller('me/security')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Me')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('2fa')
  getOtpSecret() {
    return this.securityService.generatSecret();
  }
}
