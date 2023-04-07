import { Injectable, NotFoundException } from "@nestjs/common";
import { MusicianRepository } from "./musician.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Musician } from "./musician.entity";
import { ArtistType } from "src/commons/enums/artist-type.enum";
import { Gender } from "src/commons/enums/gender.enum";
import { DeleteResult } from "typeorm";
import { MusicianAlbums } from "../musician-album/musician-album.entity";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";
import * as fs from 'fs';

@Injectable()
export class MusicianService {
    constructor(
        @InjectRepository(MusicianRepository) private musicianRepository: MusicianRepository) {
    }

    async getAllMusician(): Promise<Musician[]> {
        return await this.musicianRepository.find();
    }

    async getLimitedMusician(limit: number): Promise<Musician[]> {
        return await this.musicianRepository.getLimitedMusicians(limit);
    }

    async getFilterdMusician(
        limit: number,
        type: ArtistType,
        nationality: string,
        gender: Gender): Promise<Musician[]> {
        return await this.musicianRepository.getFilteredMusicians(limit, nationality, type, gender);
    }

    async getMusicianById(id: number): Promise<Musician> {
        const musician = await this.musicianRepository.findOne({
            where: { id }
        });
        if (!musician) {
            throw new NotFoundException(`Musician not found with id: ${id}`);
        }
        return musician;
    }

    //lam sau
    async createNewAlbum(musicianId: number, createAlbumDto: CreateAlbumDto): Promise<MusicianAlbums> {
        const musician = await this.getMusicianById(musicianId);
        const musicianAlbum = new MusicianAlbums();
        const { name } = createAlbumDto;
        musicianAlbum.name = name;
        musicianAlbum.musician = musician; // will create a foreign key
        musicianAlbum.image = musician.image;
        const savedMusicianAlbum = await musicianAlbum.save();
        return savedMusicianAlbum;
    }

    async createNewMusician(
        name: string,
        info: string,
        gender: Gender,
        nationality: string,
        type: ArtistType,
        image: string,
    ): Promise<Musician> {
        const musician = new Musician();
        musician.name = name;
        musician.info = info;
        musician.gender = gender;
        musician.nationality = nationality;
        musician.type = type;
        musician.image = image;
        const savedMusician = await musician.save();
        return musician;
    }

    async deleteMusician(musicianId: number): Promise<DeleteResult> {
        const musician = await this.getMusicianById(musicianId);
        if (musician.image) {
            fs.unlink(musician.image, (err) => {
                if (err) {
                    console.log('--------------------------------', err);
                }
            });
        }

        const result = await this.musicianRepository.delete(musicianId)
        if (result.affected === 0) {
            throw new NotFoundException(`Musician with id ${musicianId} does not found`);
        }
        return result;
    }

    async updateMusician(
        id: number,
        name: string,
        info: string,
        gender: Gender,
        nationality: string,
        type: ArtistType,
        image: string,
    ): Promise<Musician> {
        const musician = await this.getMusicianById(id);
        if (name) {
            musician.name = name;
        }
        if (info) {
            musician.info = info;
        }
        if (gender) {
            musician.gender = gender;
        }
        if (nationality) {
            musician.nationality = nationality;
        }
        if (type) {
            musician.type = type;
        }
        if (image) {
            fs.unlink(musician.image, (err) => {
                if (err) {
                    console.log('--------------------------------', err);
                }
            });
            musician.image = image;
        }
        const savedMusician = await musician.save();
        return musician;
    }
}