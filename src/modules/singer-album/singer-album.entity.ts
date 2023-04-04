import { AbstractAlbum } from "src/commons/classes/abstract-album";
import { Column, Entity, ManyToOne, OneToMany, Unique } from "typeorm";
import { Song } from "../song/song.entity";
import { Singer } from "../singer/singer.entity";

@Entity('singer-albums')
@Unique(['name'])
export class SingerAlbums extends AbstractAlbum {
    @ManyToOne(type => Singer, singer => singer.singerAlbums, {
        eager: false,
    })
    singer: Singer;

    @OneToMany(type => Song, song => song.singerAlbums, {
        eager: true,
    })
    songs: Song[];

    //Foreign Key
    @Column()
    singerId: number;
}