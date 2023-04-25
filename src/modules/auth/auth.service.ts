import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./repositories/user.repository";
import { Profile } from "../profile/profile.entity";
import { Favorite } from "../favorite/favorite.entity";
import { Role } from "src/commons/enums/role.enum";
import { Auth } from "src/commons/classes/auth";
import { EmailVerification } from "./entities/email-verification.entity";
import { Repository } from "typeorm";
import { Nodemailer, NodemailerDrivers } from "@crowdlinker/nestjs-mailer";
import { config } from "src/config";
import { EmailLoginDto } from "./dto/email-login.dto";
import { JwtPayload } from "src/commons/interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { ForgottenPassword } from "./entities/forgotten-password.entity";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ProfileService } from "../profile/profile.service";
import { FavoriteService } from "../favorite/favorite.service";
import { PlaylistService } from "../playlist/playlist.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(EmailVerification) private emailVerificationRepo: Repository<EmailVerification>,
        @InjectRepository(ForgottenPassword) private forgotPasswordRepo: Repository<ForgottenPassword>,
        private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>,
        private jwtService: JwtService,
        private profileService: ProfileService,
        private favoriteService: FavoriteService,
        private playlistService: PlaylistService,
    ) { }

    async signUp(
        authCredentialsDto: AuthCredentialsDto,
        createProfileDto: CreateProfileDto
    ): Promise<void> {
        const { username, password, email } = authCredentialsDto;
        if (!this.isValidEmail(email)) {
            throw new BadRequestException('You have entered an invalid email');
        }
        const user = new User();
        user.salt = await bcrypt.genSalt(10);
        const query = this.userRepository.createQueryBuilder('user');
        const isValidUsername = query.select('username')
            .where('user.username = :username', { username })
            .andWhere('user.email = :email', { email });
        const isEmailExist = query.select('email')
            .where('user.email = :email', { email });
        if (await isValidUsername.getCount()) {
            throw new ConflictException(`Username: ${username} already exist, try again later`);
        } else {
            user.username = username;
        }

        if (await isEmailExist.getCount()) {
            throw new ConflictException(`Email: ${email} already exist, try again later`);
        } else {
            user.email = email;
        }

        user.roles = [Role.USER]
        user.password = await this.userRepository.hashPassword(password, user.salt);
        user.profile = await this.createProfile(user, createProfileDto);
        user.playlists = [];
        user.auth = new Auth();
        user.auth.facebookId = null;
        user.auth.gmailId = null;
        user.auth.validEmail = false;

        //sending email verification
        await this.createEmailToken(email);
        await this.sendEmailVerification(email);
        await user.save();
    }

    async getUserMainData(user: User): Promise<{ user: User, profile: Profile, favorite: Favorite }> {
        const profile = await this.profileService.getProfileData(user);
        const favorite = await this.favoriteService.getUserFavoriteList(profile.favoriteId);
        return {
            user,
            profile,
            favorite,
        };
    }

    async singInUser(emailLoginDto: EmailLoginDto): Promise<{ accessToken: string, user: User }> {
        if (!(await this.isValidEmail(emailLoginDto.email))) {
            throw new BadRequestException('Invalid Email Signature');
        }
        const { email, user } = await this.userRepository.validateUserPassword(emailLoginDto);
        const payload: JwtPayload = { email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken, user };
    }

    async createProfile(user: User, createProfileDto: CreateProfileDto): Promise<Profile> {
        const {
            firstName,
            lastName,
            age,
            phone,
            gender,
            country,
            city,
            address,
        } = createProfileDto;
        const profile = new Profile();
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.phone = phone;
        profile.gender = gender;
        profile.age = age;
        profile.country = country;
        profile.city = city;
        profile.address = address;
        profile.user = user;
        profile.favorite = await this.createFavoriteList(profile); // create a foreign key
        return await profile.save();
    }

    async createFavoriteList(profile: Profile): Promise<Favorite> {
        const favorite = new Favorite();
        favorite.profile = profile;
        favorite.tracks = [];
        return await favorite.save();
    }

    async createEmailToken(email: string) {
        const verifiedEmail = await this.emailVerificationRepo.findOne({ email });

        if (verifiedEmail && ((new Date().getTime() - verifiedEmail.timestamp.getTime()) / 60000) < 15) {
            throw new HttpException('LOGIN_EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            const newEmailVerification = new EmailVerification();
            newEmailVerification.email = email;
            newEmailVerification.emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
            newEmailVerification.timestamp = new Date();
            await newEmailVerification.save();
            return true;
        }
    }

    async sendEmailVerification(email: string): Promise<any> {
        const verifiedEmail = await this.emailVerificationRepo.findOne({ email });
        if (verifiedEmail && verifiedEmail.emailToken) {
            const url = `<a style='text-decoration:none;' 
            href= http://${config.frontEndKeys.url}:${config.frontEndKeys.port}/${config.frontEndKeys.endpoints[1]}/${verifiedEmail.emailToken}>Click Here to confirm your email</a>`;
            return await this.nodeMailerService.sendMail({
                from: `Company <phutoannguyen2271@gmail.com>`,
                to: email,
                subject: 'Verify Email',
                text: 'Verify Email',
                html: `<h1>Hi User</h1> <br><br> <h2>Thanks for your registration</h2>
            <h3>Please Verify Your Email by clicking the following link</h3><br><br>
        ${url}`,
            }).then(info => {
                console.log('Message sent: %s', info.messageId);
            }).catch(err => {
                console.log('Message sent: %s', err);
            });
        } else {
            throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
        }
    }

    async verifyEmail(token: string): Promise<{ isFullyVerified: boolean, user: User }> {
        const verifiedEmail = await this.emailVerificationRepo.findOne({ emailToken: token });
        if (verifiedEmail && verifiedEmail.email) {
            const user = await this.userRepository.findOne({ email: verifiedEmail.email });
            if (user) {
                user.auth.validEmail = true;
                const updateUser = await user.save();
                await verifiedEmail.remove();
                return { isFullyVerified: true, user: updateUser };
            } else {
                throw new HttpException('LOGIN_EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
            }
        }
    }

    isValidEmail(email: string) {
        if (email) {
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(email);
        } else {
            return false;
        }
    }

    async sendEmailForgottenPassword(email: string): Promise<any> {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new HttpException('LOGIN_USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        }
        const tokenModel = await this.createForgottenPasswordToken(email);
        if (tokenModel && tokenModel.newPasswordToken) {
            const url = `<a style='text-decoration:none;' 
            href= http://${config.frontEndKeys.url}:${config.frontEndKeys.port}/${config.frontEndKeys.endpoints[0]}/${tokenModel.newPasswordToken}>Click here to reset password</a>`;
            return await this.nodeMailerService.sendMail({
                from: `Company <phutoannguyen2271@gmail.com>`,
                to: email,
                subject: 'Reset Your Password',
                text: 'Reset Your Password',
                html: `<h1>Hi User</h1> <br><br> <h2>ThanYou have requested to reset your password , please click the following link to change your password</h2>
            <h3>Please click the following link</h3><br><br>
        ${url}`,
            }).then(info => {
                console.log('Message sent: %s', info.messageId);
            }).catch(err => {
                console.log('Message sent: %s', err);
            });
        }
    }

    async createForgottenPasswordToken(email: string) {
        let forgottenPassword = await this.forgotPasswordRepo.findOne({ email });
        if (forgottenPassword && ((new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000) < 15) {
            throw new HttpException('RESET_PASSWORD_EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            forgottenPassword = new ForgottenPassword();
            forgottenPassword.email = email;
            forgottenPassword.timestamp = new Date();
            forgottenPassword.newPasswordToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
            return await forgottenPassword.save();
        }
    }

    async checkPassword(email: string, password: string) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new HttpException('User dose not found', HttpStatus.NOT_FOUND);
        }
        return await bcrypt.compare(password, user.password);
    }

    async setNewPassword(resetPasswordDto: ResetPasswordDto) {
        let isNewPasswordChanged = false;
        const { email, newPasswordToken, currentPassword, newPassword } = resetPasswordDto;
        if (email && currentPassword) {
            const isValidPassword = await this.checkPassword(email, currentPassword);
            if (isValidPassword) {
                isNewPasswordChanged = await this.setPassword(email, newPassword);
            } else {
                throw new HttpException('RESET_PASSWORD_WRONG_CURRENT_PASSWORD', HttpStatus.CONFLICT);
            }
        } else if (newPasswordToken) {
            const forgottenPassword = await this.forgotPasswordRepo.findOne({ newPasswordToken });
            isNewPasswordChanged = await this.setPassword(forgottenPassword.email, newPassword);
            if (isNewPasswordChanged) {
                await this.forgotPasswordRepo.delete(forgottenPassword.id);
            }
        } else {
            return new HttpException('RESET_PASSWORD_CHANGE_PASSWORD_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return isNewPasswordChanged;
    }

    async setPassword(email: string, newPassword: string) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new HttpException('User dose not found', HttpStatus.NOT_FOUND);
        }
        user.password = await this.userRepository.hashPassword(newPassword, user.salt);
        await user.save();
        return true;
    }

    async signInAdmin(emailLoginDto: EmailLoginDto): Promise<{ accessToken: string, user: User }> {
        if (!(await this.isValidEmail(emailLoginDto.email))) {
            throw new BadRequestException('Invalid Email Signature');
        }
        const { email, user } = await this.userRepository.validateAdminPassword(emailLoginDto);
        const payload: JwtPayload = { email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken, user };
    }

    async getSystemUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        if (!user) {
            throw new NotFoundException(`User with Id ${id} Does not found`);
        }
        return user;
    }

    async editUserRoles(id: number, roles: Role[]): Promise<User> {
        const user = await this.getUserById(id);
        if (roles) {
            user.roles = roles;
        }
        return await user.save();
    }

    async deleteUserAccount(user: User) {
        const profile = await this.profileService.getProfileData(user);
        const favoriteId = profile.favoriteId;
        // const subscriber = await this.notificationService.getSubscriberById(user.subscriberId);

        // procedure-1: delete-user-playlists/ messages/ and related rooms
        for (let i = 0; i < user.playlists.length; i++) {
            await this.playlistService.deletePlaylist(user.playlists[i].id);
        }

        // await this.chatService.deleteUserMessages(user);
        // await this.chatService.deleteUserJoinedRooms(user);


        // procedure-2: delete-user
        await this.userRepository.delete(user.id);

        // procedure-3: delete-user-profile
        await this.profileService.deleteProfile(profile.id);

        // procedure-4: delete user subscriber
        // await this.notificationService.deleteSubscriber(subscriber.id);
        // procedure-5: delete-user-favorite-list

        await this.favoriteService.deleteFavoriteList(favoriteId);

        return true;
    }

    async isValidUsername(username: string): Promise<boolean> {
        const query = this.userRepository.createQueryBuilder('user').select('username');
        query.where('user.username LIKE :username', { username });
        const count = await query.getCount();
        return count >= 1;
    }
}