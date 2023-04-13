import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ArtistType } from "src/commons/enums/artist-type.enum";
import { Gender } from "src/commons/enums/gender.enum";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";
import { SingersService } from "./singers.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ApiTags } from '@nestjs/swagger';

@Controller('singers')
@ApiTags("Singers")
export class SingerController {

    constructor(
        private singersService: SingersService) {
    }

    //localhost:3000/singers
    @Get()
    getAllSingers() {
        return this.singersService.getAllSingers();
    }

    //localhost:3000/singers/filtered
    @Get('filtered')
    getFilterdSingers(
        @Query('limit') limit: number,
        @Query('type') type: ArtistType,
        @Query('nationality') nationality: string,
        @Query('gender') gender: Gender) {
        return this.singersService.getFilterdSingers(limit, type, nationality, gender);
    }

    //localhost:3000/singers/limited
    @Get('limited')
    getLimitedSingers(@Query('limit') limit: number) {
        return this.singersService.getLimitedSingers(limit);
    }

    //localhost:3000/singers
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/singer-album/singers',
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
    createNewSinger(
        @Body('name') name: string,
        @Body('info') info: string,
        @Body('gender') gender: Gender,
        @Body('nationnality') nationnality: string,
        @Body('type') type: ArtistType,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log('----------', file);
        return this.singersService.createNewSinger(name, info, gender, nationnality, type, file.path);
    }

    //localhost:3000/singers/:id
    @Get(':id')
    getSingerById(@Param('id') id: number) {
        return this.singersService.getSingerById(id);
    }

    //localhost:3000/singers/:id/new-album
    @Post(':id/new-album')
    createNewAlbum(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto) {
        return this.singersService.createNewAlbum(id, createAlbumDto);
    }

    //localhost:3000/singers/:id/update-singer
    @Put(':id/update-singer')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/singer-album/singers',
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
    updateSinger(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('info') info: string,
        @Body('gender') gender: Gender,
        @Body('nationnality') nationnality: string,
        @Body('type') type: ArtistType,
        @UploadedFile() file: Express.Multer.File) {
        return this.singersService.updateSinger(id, name, info, gender, nationnality, type, file.path);
    }

    //localhost:3000/singers/:id/delete-singer
    @Delete(':id/delete-singer')
    deleteSinger(@Param('id') id: number) {
        return this.singersService.deleteSinger(id);
    }
}