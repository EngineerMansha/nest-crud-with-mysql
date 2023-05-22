import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'user name is must be unique and Not empty',
  })
  username: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  password: string;
}
