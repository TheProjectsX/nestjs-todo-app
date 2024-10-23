import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register new User
  async register(body: RegisterUserDto): Promise<{
    userInfo: Object;
    jwtToken: string;
  }> {
    const passwordHash = bcrypt.hashSync(body.password, 12);
    body['password'] = passwordHash;

    try {
      const { password: _, ...userInfo } = await this.prismaService.user.create(
        { data: body },
      );
      const jwtToken = await this.jwtService.signAsync({
        id: userInfo.id,
        email: userInfo.email,
      });

      return { userInfo, jwtToken };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Email already Exists!');
      } else {
        throw error;
      }
    }
  }

  //   Login User
  async login(body: LoginUserDto): Promise<{
    userInfo: Object;
    jwtToken: string;
  }> {
    const userInDb = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (!userInDb) {
      throw new ForbiddenException('Invalid Credentials');
    }

    const passMatch = bcrypt.compareSync(body.password, userInDb.password);
    if (!passMatch) {
      throw new ForbiddenException('Invalid Credentials');
    }
    const { password: _, ...userInfo } = userInDb;

    const jwtToken = await this.jwtService.signAsync({
      id: userInfo.id,
      email: userInfo.email,
    });
    return { userInfo, jwtToken };
  }
}
