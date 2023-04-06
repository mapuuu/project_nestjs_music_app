import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicicRepository } from "./music.repository";
import { Music } from "./music.entity";
import { MusicType } from "src/commons/enums/music-type.enum";
import { DeleteResult } from "typeorm";

@Injectable()
export class MusicService {

    constructor(
        @InjectRepository(MusicicRepository) private musicicRepository: MusicicRepository) {
    }

    async getAllMusics(): Promise<Music[]> {
        return await this.musicicRepository.find();
    }

    async getLimitedMusics(limit: number): Promise<Music[]> {
        return await this.musicicRepository.getLimitedMusics(limit);
    }

    async getFilteredMusics(
        limit: number,
        type: MusicType,
        rate: number): Promise<Music[]> {
        return await this.musicicRepository.getFilteredMusics(limit, type, rate);
    }

    async getMusicById(id: number): Promise<Music> {
        const music = await this.musicicRepository.findOne({
            where: { id },
        });
        if (!music) {
            throw new NotFoundException(`Music with id: ${id} not found`);
        }
        return music;
    }

    async updateMusic(
        id: number,
        name: string,
        description: string,
        artist: string,
        type: MusicType,
        image: any): Promise<Music> {
        const music = await this.getMusicById(id);
        if (name) {
            music.name = name;
        }
        if (description) {
            music.description = description;
        }
        if (artist) {
            music.artist = artist;
        }
        if (type) {
            music.type = type;
        }
        if (image) {
            music.source = image;
        }
        const updatedMusic = await music.save();
        return updatedMusic;
    }

    async deleteMusic(id: number): Promise<DeleteResult> {
        const result = await this.musicicRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Music with id ${id} does not found`);
        }
        return result;
    }
}