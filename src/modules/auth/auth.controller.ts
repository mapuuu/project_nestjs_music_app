import { Body, Controller, Post, Get, Param, UseGuards, Put, ParseIntPipe, Delete } from "@nestjs/common";
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

    @Post('login/user')
    signInUser(@Body('emailLoginDto') emailLoginDto: EmailLoginDto) {
        return this.authService.singInUser(emailLoginDto);
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

    @Delete('delete-user-account')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    deleteUserAccount(@GetAuthenticatedUser() user: User) {
        return this.authService.deleteUserAccount(user);
    }

    @Get('check-username/:username')
    isValidUsername(@Param('username') username: string) {
        return this.authService.isValidUsername(username);
    }

    @Post('login/admin')
    signInAdmin(@Body() emailLoginDto: EmailLoginDto) {
        return this.authService.signInAdmin(emailLoginDto);
    }

    @Get('system-users')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    getSystemUsers() {
        return this.authService.getSystemUsers();
    }

    @Put('edit-user-roles/:userId')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    editUserRoles(@Param('userId', ParseIntPipe) userId: number, @Body() roles: Role[]) {
        return this.authService.editUserRoles(userId, roles);
    }
}