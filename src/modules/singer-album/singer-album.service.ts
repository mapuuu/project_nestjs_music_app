import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SingerAlbums } from "./singer-album.entity";
import { DeleteResult, Repository } from "typeorm";
import { SongType } from "src/commons/enums/song-type.enum";
import { SongLanguage } from "src/commons/enums/song-language.enum";
import { Song } from "../song/song.entity";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";

@Injectable()
export class SingerAlbumService {

    constructor(
        @InjectRepository(SingerAlbums) private singerAlbumRepository: Repository<SingerAlbums>
    ) { }

    async getAllSingerAlbums(): Promise<SingerAlbums[]> {
        return await this.singerAlbumRepository.find();
    }

    async getSingerAlbumById(id: number): Promise<SingerAlbums> {
        const singerAlbum = await this.singerAlbumRepository.findOne({
            where: { id },
        });
        if (!singerAlbum) {
            throw new NotFoundException(`Singer Album with id; ${id} not found`);
        }
        return singerAlbum;
    }

    async createNewSong(
        singerAlbumId: number,
        name: string,
        description: string,
        artist: string,
        type: SongType,
        language: SongLanguage,
        source: any
    ): Promise<Song> {
        const song = new Song();
        const singerAlbum = await this.getSingerAlbumById(singerAlbumId);
        song.name = name;
        song.description = description;
        song.artist = artist;
        song.type = type;
        song.language = language;
        song.tempImage = singerAlbum.image;
        song.source = source;
        song.singerAlbums = singerAlbum;
        const savedSong = await song.save();

        return song;
    }

    async updateSingerAlbum(id: number, createAlbumDto: CreateAlbumDto): Promise<SingerAlbums> {
        const singerAlbum = await this.getSingerAlbumById(id);
        const { name } = createAlbumDto;
        if (name) {
            singerAlbum.name = name;
        }
        const savedSingerAlbum = await singerAlbum.save();
        return savedSingerAlbum;
    }

    async deleteSingerAlbum(id: number): Promise<DeleteResult> {
        const result = await this.singerAlbumRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Singer Album with id ${id} does not found`);
        }
        return result;
    }
}