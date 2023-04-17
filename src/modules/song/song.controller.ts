import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { SongLanguage } from "src/commons/enums/song-language.enum";
import { SongType } from "src/commons/enums/song-type.enum";
import { SongService } from "./song.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
@Controller('songs')
@ApiTags("Song")
export class SongController {

    constructor(private songService: SongService) {
    }

    //localhost:3000/songs
    @Get()
    getAllSongs() {
        return this.songService.getAllSongs();
    }

    //localhost:3000/songs/limited
    @Get('limited')
    getLimitedSongs(@Query('limit') limit: number) {
        return this.songService.getLimitedSongs(limit);
    }

    //localhost:3000/songs/filtered
    @Get('filtered')
    getFilteredSongs(
        @Query('limit') limit: number,
        @Query('type') type: SongType,
        @Query('language') language: SongLanguage,
        @Query('rate') rate: number) {
        return this.songService.getFilteredSongs(limit, type, language, rate);
    }

    //localhost:3000/songs/:id
    @Get(':id')
    private getSongById(@Param('id') id: number) {
        return this.songService.getSongById(id);
    }

    //localhost:3000/songs/:id/update-song
    @Put(':id/update-song')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/singer-album/songs',
            filename: (req, file, cb) => {
                const filename: string = file.originalname.split('.')[0];
                const fileExtension: string = file.originalname.split('.')[1];
                const newFilename: string = filename.split(" ").join('_') + '_' + Date.now() + '.' + fileExtension;

                cb(null, newFilename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3)$/)) {
                return cb(null, false);
            }
            cb(null, true);
        }
    }))
    updateSong(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('artist') artist: string,
        @Body('type') type: SongType,
        @Body('language') language: SongLanguage,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.songService.updateSong(id, name, description, artist, type, language, file.path);
    }

    //localhost:3000/songs/:id/delete-song
    @Delete(':id/delete-song')
    deleteSong(@Param('id') id: number) {
        return this.songService.deleteSong(id);
    }

    //localhost:3000/songs/:songId/add-to-playlist/:playlistId
    @Post(':songId/add-to-playlist/:playlistId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    addToPlaylist(@Param('songId') songId: number, @Param('playlistId') playlistId: number) {
        return this.songService.pushToPlaylist(songId, playlistId);
    }

    //localhost:3000/songs/:songId/save-to-favorite-list/:favoriteId
    @Post(':songId/save-to-favorite-list/:favoriteId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    saveToFavoriteList(@Param('songId') songId: number, @Param('favoriteId') favoriteId: number) {
        return this.songService.pushToFavoriteList(songId, favoriteId);
    }
}