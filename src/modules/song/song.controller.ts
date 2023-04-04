import { Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { SongLanguage } from "src/commons/enums/song-language.enum";
import { SongType } from "src/commons/enums/song-type.enum";

@Controller('songs')
export class SongController {

    //localhost:3000/songs
    @Get()
    getAllSongs() {
        return 'all songs';
    }

    //localhost:3000/songs/limited
    @Get('limited')
    getLimitedSongs(@Query('limit') limit: number) {
        return `Songs limited with count ${limit}`;
    }

    //localhost:3000/songs/filtered
    @Get('filtered')
    getFilteredSongs(
        @Query('limit') limit: number,
        @Query('type') type: SongType,
        @Query('language') language: SongLanguage,
        @Query('rate') rate: number) {
        return { limit, type, language, rate };
    }

    //localhost:3000/songs/:id
    @Get(':id')
    private getSongById(@Param('id') id: number) {
        return `Song with id ${id}`;
    }

    //localhost:3000/songs/:id/update-song
    @Put(':id/update-song')
    updateSong(@Param('id') id: number) {
        return `Song with id ${id} updated`;
    }

    //localhost:3000/songs/:id/delete-song
    @Delete(':id/delete-song')
    deleteSong(@Param('id') id: number) {
        return `Song with id ${id} deleted`;
    }

    //localhost:3000/songs/:songId/add-to-playlist/:playlistId
    @Post(':songId/add-to-playlist/:playlistId')
    addToPlaylist(@Param('songId') songId: number, @Param('playlistId') playlistId: number) {
        return { playlistIdis: playlistId, songIdIs: songId };
    }

    //localhost:3000/songs/:songId/save-to-favorite-list/:favoriteId
    @Post(':songId/save-to-favorite-list/:favoriteId')
    saveToFavoriteList(@Param('songId') songId: number, @Param('favoriteId') favoriteId: number) {
        return { favoriteIdIs: favoriteId, songIdIs: songId };
    }
}