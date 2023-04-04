import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "../profile/profile.entity";
import { Track } from "../track/track.entity";

@Entity('favorite-lists')
export class Favorite extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Profile, profile => profile.favorite)
    profile: Profile;

    @OneToMany(type => Track, track => track.playlists, {
        eager: true,
    })
    tracks: Track[];
}