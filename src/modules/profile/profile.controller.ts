import { Body, Controller, Delete, Get, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { CreateProfileDto } from "../auth/dto/create-profile.dto";
import { GetAuthenticatedUser } from "src/commons/decorators/get-authenticated-user.decorator";
import { User } from "../auth/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { AcceptedAuthGuard } from "src/commons/guards/accepted-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { ProfileService } from "./profile.service";

@UseGuards(AuthGuard(), AcceptedAuthGuard)
@Roles([Role.ADMIN, Role.USER])
@Controller('profiles')
@ApiTags('Profiles')
export class ProfileController {

    constructor(private profileService: ProfileService) { }

    @Get('user-profile')
    getUserProfile(@GetAuthenticatedUser() user: User) {
        return this.profileService.getProfileData(user);
    }

    @Post('user-profile/set-profile-image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profiles',
            filename: (req, file, cb) => {
                const filename: string = file.originalname.split('.')[0];
                const fileExtension: string = file.originalname.split('.')[1];
                const newFilename: string = filename.split(" ").join('_') + '_' + Date.now() + '.' + fileExtension;

                cb(null, newFilename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3)$/)) {
                return cb(null, false);
            }
            cb(null, true);
        }
    }))
    setProfileImage(
        @GetAuthenticatedUser() user: User,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.profileService.setProfileImage(user, file.path);
    }

    @Patch('user-profile/change-profile-image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profiles',
            filename: (req, file, cb) => {
                const filename: string = file.originalname.split('.')[0];
                const fileExtension: string = file.originalname.split('.')[1];
                const newFilename: string = filename.split(" ").join('_') + '_' + Date.now() + '.' + fileExtension;

                cb(null, newFilename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3)$/)) {
                return cb(null, false);
            }
            cb(null, true);
        }
    }))
    changeProfileImage(
        @GetAuthenticatedUser() user: User,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.profileService.changeProfileImage(user, file.path);
    }

    @Put('user-profile/edit-profile')
    editProfile(
        @GetAuthenticatedUser() user: User,
        @Body('createProfileDto') createProfileDto: CreateProfileDto,
    ) {
        return this.profileService.editProfile(user, createProfileDto);
    }

    @Delete('user-profile/delete-profile-image')
    deleteProfileImage(@GetAuthenticatedUser() user: User) {
        return this.profileService.deleteProfileImage(user);
    }
}