import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Delete,
  Post,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
// import { ApiResponse } from '@nestjs/swagger';
// import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import * as bcrypt from 'bcrypt';
import { Login } from 'src/users/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService, private jwtS: JwtService) {}
  @Get()
  async getUsers(@Req() req: Request) {
    try {
      const cookie = req.cookies['jwt'];
      console.log('cookie', cookie);
      const data = await this.jwtS.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      }
      return this.userServices.findUser();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  @Get('one/:id')
  async getOneUser(@Param('id', ParseIntPipe) id: string) {
    console.log('iddddddddd', id);
    await this.userServices.findOne(id);
  }
  @Post('/register')
  // @ApiResponse({
  //   status: 201,
  //   description: 'The record has been successfully created.',
  // })
  // @ApiCreatedResponse({
  //   description: 'The record has been successfully created.',
  // })
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    let password = createUserDto.password;
    let saltOrRounds: number = 12;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);
    let obj = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashPassword,
    };
    console.log('my obj', obj);

    this.userServices.createUser(obj);
    return { data: obj };
  }
  @Post('/login')
  async login(@Body() login: Login, @Res({ passthrough: true }) res: Response) {
    const user_login: any = await this.userServices.loginUser(login.email);
    console.log('user', user_login);
    if (!user_login) {
      throw new BadRequestException('invalid User name and password');
    }
    if (!(await bcrypt.compare(login.password, user_login.password))) {
      throw new BadRequestException('Wrong Password');
    }
    const jwt = await this.jwtS.signAsync(user_login.username);
    res.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'Login Done',
      Token: jwt,
    };
  }

  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    await this.userServices.updateUserById(id, UpdateUserDto);
  }
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userServices.deleteUser(id);
  }
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return {
      message: 'logout Done ',
    };
  }
}
