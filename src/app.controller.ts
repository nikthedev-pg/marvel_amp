import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from './users/dtos/user.dto';
import { UserService } from './users/user.service';
import { SuperHerosService } from './superheros/superheros.service';
import { UsersGuard } from './guards/users.guard';
import { JwtService } from './users/jwt.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly superHeros: SuperHerosService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/signup')
  createAccount(@Body() body: User) {
    return this.userService.signup(body);
  }

  @Post('/login')
  async login(@Body() body: User) {
    const user = await this.userService.login(body.mobileNumber, body.password);

    const { id, email } = user;

    if (!user) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return {
      accessToken: this.jwtService.generateToken({
        id,
        email,
      }),
    };
  }

  @Get('/superheros/:userId')
  @UseGuards(UsersGuard)
  async getSuperHeros(
    @Param('userId') userId: string,
    @Query('nameStartsWith') nameStartsWith: string,
    @Req() req: any,
  ) {
    if (req.user.id !== parseInt(userId)) {
      throw new UnauthorizedException(
        'You are not allowed to access this resource!!',
      );
    }

    return this.superHeros.getSuperHeros(nameStartsWith);
  }
}
