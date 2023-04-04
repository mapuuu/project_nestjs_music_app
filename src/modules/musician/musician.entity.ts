import { AbstractArtist } from "src/commons/classes/abstract-artist";
import { Entity, OneToMany } from "typeorm";
import { MusicianAlbums } from "../musician-album/musician-album.entity";

@Entity('musicians')
export class Musician extends AbstractArtist {
    @OneToMany(type => MusicianAlbums, musicianAlbum => musicianAlbum.musician, {
        eager: true,
    })
    musicianAlbums: MusicianAlbums[];
}