import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract JWT token from cookies
    const token = request.cookies['access_token'];

    // Check if the token exists
    if (!token) {
      throw new UnauthorizedException('Unauthorized Request');
    }

    try {
      // Verify the token's validity
      const payload = await this.jwtService.verifyAsync(token);

      // Attach the decoded payload to the request object for later use
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized Request');
    }

    return true; // Allow the request if the token is valid
  }
}
