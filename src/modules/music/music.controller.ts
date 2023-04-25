import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MusicType } from "src/commons/enums/music-type.enum";
import { MusicService } from "./music.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";
@Controller('musics')
@ApiTags("Music")
export class MusicController {

    constructor(private musicService: MusicService) {
    }

    //localhost:3000/musics
    @Get()
    getAllMusics() {
        return this.musicService.getAllMusics();
    }

    //localhost:3000/musics/limited
    @Get('limited')
    getLimitedMusics(@Query('limit') limit: number) {
        return this.musicService.getLimitedMusics(limit);
    }

    //localhost:3000/musics/filtered
    @Get('filtered')
    getFilteredMusics(
        @Query('limit') limit: number,
        @Query('type') type: MusicType,
        @Query('rate') rate: number) {
        return this.musicService.getFilteredMusics(limit, type, rate);
    }

    //localhost:3000/musics/:id
    @Get(':id')
    private getMusicById(@Param('id') id: number) {
        return this.musicService.getMusicById(id);
    }

    //localhost:3000/musics/:id/update-music
    @Put(':id/update-music')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/musician-album/musics',
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
    updateMusic(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('artist') artist: string,
        @Body('type') type: MusicType,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.musicService.updateMusic(id, name, description, artist, type, file.path);
    }

    //localhost:3000/musics/:id/delete-music
    @Delete(':id/delete-music')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    deleteMusic(@Param('id') id: number) {
        return this.musicService.deleteMusic(id);
    }

    //localhost:3000/musics/:musicId/add-to-playlist/:playlistId
    @Post(':musicId/add-to-playlist/:playlistId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    addToPlaylist(@Param('musicId') musicId: number, @Param('playlistId') playlistId: number) {
        return this.musicService.pushToPlaylist(musicId, playlistId);
    }

    //localhost:3000/musics/:musicId/save-to-favourite-list/:favouriteId
    @Post(':musicId/save-to-favourite-list/:favouriteId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    saveToFavouriteList(@Param('musicId') musicId: number, @Param('favouriteId') favouriteId: number) {
        return this.musicService.pushToFavoriteList(musicId, favouriteId);
    }
}