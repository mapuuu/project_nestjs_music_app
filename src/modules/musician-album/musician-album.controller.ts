import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common/decorators";
import { CreateAlbumDto } from "src/shared/dto/create-album.dto";

@Controller('musician-albums')
export class MusicianAlbummController {

    //localhost:3000/musician-albums
    @Get()
    getAllMusicianAlbums() {
        return 'musician-albums';
    }

    //localhost:3000/musician-albums/:id
    @Get(':id')
    getMusicianAlbumById(@Param('id') id: number) {
        return `Musician Album with id: ${id}`;
    }

    //localhost:3000/musician-albums/:id/new-music
    @Post(':id/new-music')
    createNewMusic(
        @Param('id') id: number,
        @Body() musicData: any) {
        return `${id} ---------- ${musicData}`;
    }

    //localhost:3000/musician-albums/:id/update-album
    @Put(':id/update-album')
    updateAlbum(
        @Param('id') id: number,
        @Body('createAlbumDto') createAlbumDto: CreateAlbumDto) {
        const { name } = createAlbumDto;
        return { id, name };
    }

    //localhost:3000/musician-albums/:id/delete-album
    @Delete(':id/delete-album')
    deleteAlbum(
        @Param('id') id: number) {
        return `Deleting Album with id: ${id}`;
    }
}