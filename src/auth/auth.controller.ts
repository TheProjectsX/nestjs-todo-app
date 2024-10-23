import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Register new User
  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { userInfo, jwtToken } = await this.authService.register(body);
    response.cookie('access_token', jwtToken).json(userInfo);
  }

  //   Login User
  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { userInfo, jwtToken } = await this.authService.login(body);
    response.cookie('access_token', jwtToken).json(userInfo);
  }

  //   Logout User
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token').json({ msg: 'Logout Successful' });
  }
}
