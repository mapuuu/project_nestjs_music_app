import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common/decorators";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";
import { MusicianAlbumService } from "./musician-album.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MusicType } from "src/commons/enums/music-type.enum";
@Controller('musician-albums')
export class MusicianAlbummController {

    constructor(
        private musicianAlbumsService: MusicianAlbumService
    ) { }

    //localhost:3000/musician-albums
    @Get()
    getAllMusicianAlbums() {
        return this.musicianAlbumsService.getAllMusicianAlbums();
    }

    //localhost:3000/musician-albums/:id
    @Get(':id')
    getMusicianAlbumById(@Param('id') id: number) {
        return this.musicianAlbumsService.getMusicianAlbumById(id);
    }

    //localhost:3000/musician-albums/:id/new-music
    @Post(':id/new-music')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/musics',
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
    createNewMusic(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('artist') artist: string,
        @Body('type') type: MusicType,
        @UploadedFile() file: Express.Multer.File) {
        console.log('----------', file);
        return this.musicianAlbumsService.createNewMusic(id, name, description, artist, type, file.path);
    }

    //localhost:3000/musician-albums/:id/update-album
    @Put(':id/update-album')
    updateAlbum(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto) {
        return this.musicianAlbumsService.updateMusicianAlbum(id, createAlbumDto);
    }

    //localhost:3000/musician-albums/:id/delete-album
    @Delete(':id/delete-album')
    deleteAlbum(
        @Param('id') id: number) {
        return this.musicianAlbumsService.deleteMusicAlbum(id);
    }
}