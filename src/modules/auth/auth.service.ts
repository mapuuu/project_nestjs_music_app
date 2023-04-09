import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { User } from "./entities/user.entity";
import bcrypt from 'bcryptjs';
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./repositories/user.repository";
import { Profile } from "../profile/profile.entity";
import { Favorite } from "../favorite/favorite.entity";
import { Role } from "src/commons/enums/role.enum";
import { Auth } from "src/commons/classes/auth";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
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
        user.salt = await bcrypt.genSalt();
        const query = this.userRepository.createQueryBuilder('user');
        const isValidUsername = query.select('username')
            .where('user.username LIKE: username', { username })
            .andWhere('user.email LIKE: email', { email });

        const isEmailExist = query.select('email')
            .where('user.email LIKE: email', { email });

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

    isValidEmail(email: string) {
        if (email) {
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(email);
        } else {
            return false;
        }
    }
}