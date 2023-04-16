import { Injectable, NotFoundException } from "@nestjs/common";
import { PlaylistRepository } from "./playlist.repository";
import { User } from "../auth/entities/user.entity";
import { Playlist } from "./playlist.entity";
import { PlaylistDto } from "./dto/playlist.dto";
import { DeleteResult } from "typeorm";

@Injectable()
export class PlaylistService {

    constructor(private playlistRepository: PlaylistRepository) {

    }

    async getUserPlaylists(user: User): Promise<Playlist[]> {
        return await this.playlistRepository.getUserPlaylists(user.id);
    }

    async getPlaylistById(id: number): Promise<Playlist> {
        const playlist = await this.playlistRepository.findOne({
            where: {
                id,
            },
        });
        if (!playlist) {
            throw new NotFoundException(`Playlist with Id ${id} Does not found`);
        }
        return playlist;
    }

    async newPlaylist(user: User, playlistDto: PlaylistDto): Promise<Playlist> {
        const { name } = playlistDto;
        const playlist = new Playlist();
        playlist.name = name;
        playlist.user = user; // this will create a foreign key called userId
        playlist.tracks = [];
        return await playlist.save();
    }

    async updatePlaylist(id: number, playlistDto: PlaylistDto): Promise<Playlist> {
        const { name } = playlistDto;
        const playlist = await this.getPlaylistById(id);
        if (name) {
            playlist.name = name;
        }
        return await playlist.save();
    }

    async deletePlaylist(id: number): Promise<DeleteResult> {
        const result = await this.playlistRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Playlist with Id ${id} Does not found`);
        }
        return result;
    }

}