import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Gender } from "src/commons/enums/gender.enum";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";
import { MusicianService } from "./musician.service";
import { ArtistType } from "src/commons/enums/artist-type.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ApiTags } from '@nestjs/swagger';
@Controller('musicians')
@ApiTags("Musician")
export class MusicianController {

    constructor(
        private musicianService: MusicianService) {
    }

    //localhost:3000/musicians
    @Get()
    getAllMusicians() {
        return this.musicianService.getAllMusician();
    }

    //localhost:3000/musicians/filtered
    @Get('filtered')
    getFilterdMusicians(
        @Query('limit') limit: number,
        @Query('type') type: ArtistType,
        @Query('nationality') nationality: string,
        @Query('gender') gender: Gender) {
        return this.musicianService.getFilterdMusician(limit, type, nationality, gender);
    }

    //localhost:3000/musicians/limited
    @Get('limited')
    getLimitedMusicians(@Query('limit') limit: number) {
        return this.musicianService.getLimitedMusician(limit);
    }

    //localhost:3000/musicians
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/musician-album/musicians',
            filename: (req, file, cb) => {
                const filename: string = file.originalname.split('.')[0];
                const fileExtension: string = file.originalname.split('.')[1];
                const newFilename: string = filename.split(" ").join('_') + '_' + Date.now() + '.' + fileExtension;

                cb(null, newFilename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(null, false);
            }
            cb(null, true);
        }
    }))
    createNewMusician(
        @Body('name') name: string,
        @Body('info') info: string,
        @Body('gender') gender: Gender,
        @Body('nationnality') nationnality: string,
        @Body('type') type: ArtistType,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log('-------file', file);
        return this.musicianService.createNewMusician(name, info, gender, nationnality, type, file.path);
    }

    //localhost:3000/musicians/:id
    @Get(':id')
    getMusicianById(@Param('id') id: number) {
        return this.musicianService.getMusicianById(id);
    }

    //localhost:3000/musicians/:id/new-album
    @Post(':id/new-album')
    createNewAlbum(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto) {
        return this.musicianService.createNewAlbum(id, createAlbumDto);
    }

    //localhost:3000/musicians/:id/update-musician
    @Put(':id/update-musician')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/musician-album/musicians',
            filename: (req, file, cb) => {
                const filename: string = file.originalname.split('.')[0];
                const fileExtension: string = file.originalname.split('.')[1];
                const newFilename: string = filename.split(" ").join('_') + '_' + Date.now() + '.' + fileExtension;

                cb(null, newFilename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(null, false);
            }
            cb(null, true);
        }
    }))
    updateMusician(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('info') info: string,
        @Body('gender') gender: Gender,
        @Body('nationnality') nationnality: string,
        @Body('type') type: ArtistType,
        @UploadedFile() file: Express.Multer.File) {
        return this.musicianService.updateMusician(id, name, info, gender, nationnality, type, file.path);
    }

    //localhost:3000/musicians/:id/delete-musician
    @Delete(':id/delete-musician')
    deleteMusician(@Param('id') id: number) {
        return this.musicianService.deleteMusician(id);
    }
}