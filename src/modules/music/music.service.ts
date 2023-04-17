import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicRepository } from "./music.repository";
import { Music } from "./music.entity";
import { MusicType } from "src/commons/enums/music-type.enum";
import { DeleteResult } from "typeorm";
import * as fs from 'fs';
import { FavoriteService } from "../favorite/favorite.service";
import { Track } from "../track/track.entity";

@Injectable()
export class MusicService {

    constructor(
        @InjectRepository(MusicRepository) private musicRepository: MusicRepository,
        private favoriteService: FavoriteService,
    ) {
    }

    async getAllMusics(): Promise<Music[]> {
        return await this.musicRepository.find();
    }

    async getLimitedMusics(limit: number): Promise<Music[]> {
        return await this.musicRepository.getLimitedMusics(limit);
    }

    async getFilteredMusics(
        limit: number,
        type: MusicType,
        rate: number): Promise<Music[]> {
        return await this.musicRepository.getFilteredMusics(limit, type, rate);
    }

    async getMusicById(id: number): Promise<Music> {
        const music = await this.musicRepository.findOne({
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
        source: any): Promise<Music> {
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
        if (source) {
            fs.unlink(music.source, (err) => {
                if (err) {
                    console.log('--------------------------------', err);
                }
            });
            music.source = source;
        }
        const updatedMusic = await music.save();
        return updatedMusic;
    }

    async deleteMusic(id: number): Promise<DeleteResult> {
        const musicic = await this.getMusicById(id);
        console.log('----------music.source:', musicic.source);
        if (musicic.source) {
            fs.unlink(musicic.source, (err) => {
                if (err) {
                    console.log('--------------------------------', err);
                }
            });
        }

        const result = await this.musicRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Music with id ${id} does not found`);
        }
        return result;
    }

    async pushToFavoriteList(musicId: number, favoriteListId: number): Promise<Track> {
        const music = await this.getMusicById(musicId);
        const track = await this.favoriteService.createFavoriteTrack(null, music, favoriteListId);
        return track;
    }
}