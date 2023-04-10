import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('register')
    signUp(
        @Body('authCredentialsDto') authCredentialsDto: AuthCredentialsDto,
        @Body('createProfileDto') createProfileDto: CreateProfileDto,
    ) {
        return this.authService.signUp(authCredentialsDto, createProfileDto);
    }

    @Get('email/verify/:token')
    verifyEmail(@Param('token') token: string) {
        return this.authService.verifyEmail(token);
    }
}