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

    @Post('login')
    signIn(@Body('emailLoginDto') emailLoginDto: EmailLoginDto) {
        return this.authService.singIn(emailLoginDto);
    }

    @Get('user-endpoint')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    userEndpoint() {
        return 'You have the access to this endpoint as user';
    }

    @Get('admin-endpoint')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    adminEndpoint() {
        return 'You have the access to this endpoint as admin';
    }

    @Get('accepted-endpoint')
    @UseGuards(AuthGuard(), AcceptedAuthGuard)
    @Roles([Role.ADMIN, Role.USER])
    acceptedEndpoint() {
        return 'You have the access to this endpoint as admin or user';
    }
}