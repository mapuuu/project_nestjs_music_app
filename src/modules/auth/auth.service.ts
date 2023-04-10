import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(EmailVerification) private emailVerificationRepo: Repository<EmailVerification>,
        private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>,
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
        console.log('-------check');
        await this.sendEmailVerification(email);
        await user.save();
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
            console.log('-------email', email);
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
}