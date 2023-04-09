import { IsEmail } from "class-validator";

export class AuthCredentialsDto {
  username: string;

  @IsEmail()
  email: string;

  password: string;
}
