import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/users/jwt.service';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);
    if (!token) {
      return false;
    }

    const user = this.jwtService.verfiyToken(token);
    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }

  private extractToken(request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }
}
