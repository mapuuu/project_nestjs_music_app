import { Body, Controller, Post } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";

@Controller('auth')
export class AuthController {

    @Post('register')
    signUp(
        @Body('authCredentialsDto') authCredentialsDto: AuthCredentialsDto,
        @Body('createProfileDto') createProfileDto: CreateProfileDto,
    ) {

    }
}