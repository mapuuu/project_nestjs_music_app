import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicianAlbums } from "./musician-album.entity";
import { DeleteResult, Repository } from "typeorm";
import { MusicType } from "src/commons/enums/music-type.enum";
import { Music } from "../music/music.entity";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";

@Injectable()
export class MusicianAlbumService {

    constructor(
        @InjectRepository(MusicianAlbums) private musicanAlbumRepository: Repository<MusicianAlbums>
    ) { }

    async getAllMusicianAlbums(): Promise<MusicianAlbums[]> {
        return await this.musicanAlbumRepository.find();
    }

    async getMusicianAlbumById(id: number): Promise<MusicianAlbums> {
        const musicianAlbum = await this.musicanAlbumRepository.findOne({
            where: { id },
        });
        if (!musicianAlbum) {
            throw new NotFoundException(`Musician Album with id; ${id} not found`);
        }
        return musicianAlbum;
    }

    async createNewMusic(
        musicianAlbumId: number,
        name: string,
        description: string,
        artist: string,
        type: MusicType,
        image: any
    ): Promise<Music> {
        const music = new Music();
        const musicianAlbum = await this.getMusicianAlbumById(musicianAlbumId);
        music.name = name;
        music.description = description;
        music.artist = artist;
        music.type = type;
        music.source = image;
        music.tempImage = musicianAlbum.image
        music.musicianAlbums = musicianAlbum;
        const savedMusic = await music.save();
        return music;
    }

    async updateMusicianAlbum(id: number, createAlbumDto: CreateAlbumDto): Promise<MusicianAlbums> {
        const musicianAlbum = await this.getMusicianAlbumById(id);
        const { name } = createAlbumDto;
        if (name) {
            musicianAlbum.name = name;
        }
        const savedMusicianAlbum = await musicianAlbum.save();
        return savedMusicianAlbum;
    }

    async deleteMusicAlbum(id: number): Promise<DeleteResult> {
        const result = await this.musicanAlbumRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Musician Album with id ${id} does not found`);
        }
        return result;
    }
}