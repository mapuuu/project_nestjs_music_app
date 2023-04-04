import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Gender } from "src/commons/enums/gender.enum";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";

@Controller('musicians')
export class MusicianController {

    //localhost:3000/musicians
    @Get()
    getAllMusicians() {
        return 'all musicians';
    }

    //localhost:3000/musicians/filtered
    @Get('filtered')
    getFilterdMusicians(
        @Query('limit') limit: number,
        @Query('type') type: string,
        @Query('nationality') nationality: string,
        @Query('gender') gender: Gender) {
        return { limit, type, nationality, gender };
    }

    //localhost:3000/musicians/limited
    @Get('limited')
    getLimitedMusicians(@Query('limit') limit: number) {
        return { limit };
    }

    //localhost:3000/musicians
    @Post()
    createNewMusician() {
        return 'new musician';
    }

    //localhost:3000/musicians/:id
    @Get(':id')
    getMusicianById(@Param('id') id: number) {
        return `musician ${id}`;
    }

    //localhost:3000/musicians/:id/new-album
    @Post(':id/new-album')
    createNewAlbum(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto) {
        const { name } = createAlbumDto;
        return { id, name };
    }

    //localhost:3000/musicians/:id/update-musician
    @Put(':id/update-musician')
    updateMusician(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto) {
        const { name } = createAlbumDto;
        return { id, name };
    }

    //localhost:3000/musicians/:id/delete-musician
    @Delete(':id/delete-musician')
    deleteMusician(@Param('id') id: number) {
        return 'deleting entity with id: ' + id;
    }
}