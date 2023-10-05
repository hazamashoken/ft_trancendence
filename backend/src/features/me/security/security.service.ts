
import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class SecurityService {
  constructor() {}

  generatSecret() {
    const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
    const token = authenticator.generate(secret);
    const genSecret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri('tsomsa', 'ft_transcendence', secret);
    return {genSecret, token, otpauthUrl};
  }
}
