import { AbstractAlbum } from "src/commons/classes/abstract-album";
import { Column, Entity, ManyToOne, OneToMany, Unique } from "typeorm";
import { Music } from "../music/music.entity";
import { Musician } from "../musician/musician.entity";

@Entity('musician-albums')
@Unique(['name'])
export class MusicianAlbums extends AbstractAlbum {
    @ManyToOne(type => Musician, musician => musician.musicianAlbums, {
        eager: false,
    })
    musician: Musician;

    //Foreign Key
    @Column()
    musicianId: number;

    @OneToMany(type => Music, music => music.musicianAlbums, {
        eager: true,
    })
    musics: Music[];
}