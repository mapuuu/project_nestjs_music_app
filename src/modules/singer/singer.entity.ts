import { AbstractArtist } from "src/commons/classes/abstract-artist";
import { Entity, OneToMany, Unique } from "typeorm";
import { SingerAlbums } from "../singer-album/singer-album.entity";

@Entity('singers')
@Unique(['name'])
export class Singer extends AbstractArtist {
    @OneToMany(type => SingerAlbums, singerAlbum => singerAlbum.singer, {
        eager: true,
    })
    singerAlbums: SingerAlbums[];
}