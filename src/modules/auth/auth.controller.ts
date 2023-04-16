import { Body, Controller, Post, Get, Param, UseGuards } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { AuthService } from "./auth.service";
import { EmailLoginDto } from "./dto/email-login.dto";
import { AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";
import { AcceptedAuthGuard } from "src/commons/guards/accepted-auth.guard";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ApiTags } from '@nestjs/swagger';
import { GetAuthenticatedUser } from "src/commons/decorators/get-authenticated-user.decorator";
import { User } from "./entities/user.entity";

@Controller('auth')
@ApiTags('Auth')
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

    @Post('login')
    signIn(@Body('emailLoginDto') emailLoginDto: EmailLoginDto) {
        return this.authService.singIn(emailLoginDto);
    }

    @Get('email/forgot-password/:email')
    sendEmailForgotPassword(@Param('email') email: string) {
        return this.authService.sendEmailForgottenPassword(email);
    }

    @Post('email/reset-password')
    setNewPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.setNewPassword(resetPasswordDto);
    }

    @Get('user-main-data')
    @UseGuards(AuthGuard(), AcceptedAuthGuard)
    @Roles([Role.USER, Role.ADMIN])
    getUserData(@GetAuthenticatedUser() user: User) {
        return this.authService.getUserMainData(user);
    }
}