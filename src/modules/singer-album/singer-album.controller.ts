import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common/decorators";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";
import { SingerAlbumService } from "./singer-album.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { SongType } from "src/commons/enums/song-type.enum";
import { SongLanguage } from "src/commons/enums/song-language.enum";
import { ParseIntPipe } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
@Controller('singer-albums')
@ApiTags("Singer-Album")
export class SingerAlbummController {

    constructor(
        private singerAlbumsService: SingerAlbumService
    ) { }

    //localhost:3000/singer-albums
    @Get()
    getAllSingerAlbums() {
        return this.singerAlbumsService.getAllSingerAlbums();
    }

    //localhost:3000/singer-albums/:id
    @Get(':id')
    getSingerAlbumById(@Param('id') id: number) {
        return this.singerAlbumsService.getSingerAlbumById(id);
    }

    //localhost:3000/singer-albums/:id/new-song
    @Post(':id/new-song')
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
    createNewSong(
        @Param('id', ParseIntPipe) id: number,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('artist') artist: string,
        @Body('type') type: SongType,
        @Body('language') language: SongLanguage,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.singerAlbumsService.createNewSong(id, name, description, artist, type, language, file.path);
    }

    //localhost:3000/singer-albums/:id/update-album
    @Put(':id/update-album')
    updateAlbum(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto
    ) {
        return this.singerAlbumsService.updateSingerAlbum(id, createAlbumDto);
    }

    //localhost:3000/singer-albums/:id/delete-album
    @Delete(':id/delete-album')
    deleteAlbum(
        @Param('id') id: number
    ) {
        return this.singerAlbumsService.deleteSingerAlbum(id);
    }
}