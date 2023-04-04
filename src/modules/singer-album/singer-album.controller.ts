import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common/decorators";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";

@Controller('singer-albums')
export class SingerAlbummController {

    //localhost:3000/singer-albums
    @Get()
    getAllSingerAlbums() {
        return 'singer-albums';
    }

    //localhost:3000/singer-albums/:id
    @Get(':id')
    getSingerAlbumById(@Param('id') id: number) {
        return `Singer Album with id: ${id}`;
    }

    //localhost:3000/singer-albums/:id/new-song
    @Post(':id/new-song')
    createNewSong(
        @Param('id') id: number,
        @Body() songData: any) {
        return `${id} ---------- ${songData}`;
    }

    //localhost:3000/singer-albums/:id/update-album
    @Put(':id/update-album')
    updateAlbum(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto) {
        const { name } = createAlbumDto;
        return { id, name };
    }

    //localhost:3000/singer-albums/:id/delete-album
    @Delete(':id/delete-album')
    deleteAlbum(
        @Param('id') id: number) {
        return `Deleting Album with id: ${id}`;
    }
}