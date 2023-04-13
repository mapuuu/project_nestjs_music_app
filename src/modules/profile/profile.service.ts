import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./profile.entity";
import { Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { CreateProfileDto } from "../auth/dto/create-profile.dto";
import * as fs from 'fs';

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(Profile) private profileRepository: Repository<Profile>
    ) {
    }

    async getProfileData(user: User): Promise<Profile> {
        const profile = await this.profileRepository.findOne({
            where: {
                id: user.profileId
            }
        });
        if (!profile) {
            throw new NotFoundException('Profile does not found');
        }
        return profile;
    }

    async editProfile(
        user: User,
        createProfileDto: CreateProfileDto
    ): Promise<Profile> {
        const profile = await this.getProfileData(user);
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
        if (firstName) {
            console.log(firstName);
            profile.firstName = firstName;
        }
        if (lastName) {
            profile.lastName = lastName;
        }
        if (phone) {
            profile.phone = phone;
        }
        if (age) {
            profile.age = age;
        }
        if (address) {
            profile.address = address;
        }
        if (city) {
            profile.city = city;
        }
        if (country) {
            profile.country = country;
        }
        if (gender) {
            profile.gender = gender;
        }
        const savedProfile = await profile.save();
        return savedProfile;
    }

    async setProfileImage(user: User, image: any): Promise<Profile> {
        const profile = await this.getProfileData(user);
        if (image) {
            profile.image = image
        }
        const savedProfile = await profile.save();
        return savedProfile;
    }

    async changeProfileImage(user: User, image: any): Promise<Profile> {
        const profile = await this.getProfileData(user);
        if (image) {
            fs.unlink(profile.image, (err) => {
                if (err) {
                    console.log('--------------------------------', err);
                }
            });
            profile.image = image
        }
        const savedProfile = await profile.save();
        return savedProfile;
    }

    async deleteProfileImage(user: User): Promise<Profile> {
        const profile = await this.getProfileData(user);
        if (!profile.image) {
            throw new ConflictException('The profile is already set to null!');
        }
        fs.unlink(profile.image, (err) => {
            if (err) {
                console.log('--------------------------------', err);
            }
        });
        profile.image = null;
        const savedProfile = await profile.save();
        return savedProfile;
    }
}