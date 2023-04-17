import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SongRepository } from "./song.repository";
import { Song } from "./song.entity";
import { SongType } from "src/commons/enums/song-type.enum";
import { SongLanguage } from "src/commons/enums/song-language.enum";
import { DeleteResult } from "typeorm";
import * as fs from 'fs';
import { FavoriteService } from "../favorite/favorite.service";
import { Track } from "../track/track.entity";

@Injectable()
export class SongService {
    constructor(
        @InjectRepository(SongRepository) private songRepository: SongRepository,
        private favoriteService: FavoriteService,
    ) {
    }

    async getAllSongs(): Promise<Song[]> {
        return await this.songRepository.find();
    }

    async getSongById(id: number): Promise<Song> {
        const song = await this.songRepository.findOne({
            where: { id },
        });
        if (!song) {
            throw new NotFoundException(`Song with id: ${id} not found`);
        }
        return song;
    }

    async getLimitedSongs(limit: number): Promise<Song[]> {
        return await this.songRepository.getLimitedSongs(limit);
    }

    async getFilteredSongs(
        limit: number,
        type: SongType,
        language: SongLanguage,
        rate: number): Promise<Song[]> {
        return await this.songRepository.getFilteredSongs(limit, type, language, rate);
    }

    async updateSong(
        id: number,
        name: string,
        description: string,
        artist: string,
        type: SongType,
        language: SongLanguage,
        source: any): Promise<Song> {
        const song = await this.getSongById(id);
        if (name) {
            song.name = name;
        }
        if (description) {
            song.description = description;
        }
        if (artist) {
            song.artist = artist;
        }
        if (type) {
            song.type = type;
        }
        if (language) {
            song.language = language;
        }
        if (source) {
            fs.unlink(song.source, (err) => {
                if (err) {
                    console.log('--------------------------------', err);
                }
            });
            song.source = source;
        }
        const updatedSong = await song.save();
        return updatedSong;
    }

    async deleteSong(id: number): Promise<DeleteResult> {
        const song = await this.getSongById(id);
        if (song.source) {
            fs.unlink(song.source, (err) => {
                if (err) {
                    console.log('--------------------------------', err);
                }
            });
        }

        const result = await this.songRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Song with id ${id} does not found`);
        }
        return result;
    }

    async pushToFavoriteList(songId: number, favoriteListId: number): Promise<Track> {
        const song = await this.getSongById(songId);
        const track = await this.favoriteService.createFavoriteTrack(song, null, favoriteListId);
        return track;
    }
}