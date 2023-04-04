import { Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { MusicType } from "src/commons/enums/music-type.enum";

@Controller('musics')
export class MusicController {

    //localhost:3000/musics
    @Get()
    getAllMusics() {
        return 'all musics';
    }

    //localhost:3000/musics/:id
    @Get(':id')
    private getMusicById(@Param('id') id: number) {
        return `Music with id ${id}`;
    }

    //localhost:3000/musics/limited
    @Get('limited')
    getLimitedMusics(@Query('limit') limit: number) {
        return `musics limited with count ${limit}`;
    }

    //localhost:3000/musics/filtered
    @Get('filtered')
    getFilteredMusics(
        @Query('limit') limit: number,
        @Query('type') type: MusicType,
        @Query('rate') rate: number) {
        return { limit, type, rate };
    }

    //localhost:3000/musics/:id/update-music
    @Put(':id/update-music')
    updateMusic(@Param('id') id: number) {
        return `Music with id ${id} updated`;
    }

    //localhost:3000/musics/:id/delete-music
    @Delete(':id/delete-music')
    deleteMusic(@Param('id') id: number) {
        return `Music with id ${id} deleted`;
    }

    //localhost:3000/musics/:musicId/add-to-playlist/:playlistId
    @Post(':musicId/add-to-playlist/:playlistId')
    addToPlaylist(@Param('musicId') musicId: number, @Param('playlistId') playlistId: number) {
        return { playlistIdis: playlistId, musicIdIs: musicId };
    }

    //localhost:3000/musics/:musicId/save-to-favourite-list/:favouriteId
    @Post(':musicId/save-to-favourite-list/:favouriteId')
    saveToFavouriteList(@Param('musicId') musicId: number, @Param('favouriteId') favouriteId: number) {
        return { favouriteIdIs: favouriteId, musicIdIs: musicId };
    }
}