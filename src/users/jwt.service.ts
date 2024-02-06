import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService as _JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: _JwtService) {}

  verfiyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Incorrect Credentials');
    }
  }

  generateToken(payload: object) {
    return this.jwtService.sign(payload);
  }
}
