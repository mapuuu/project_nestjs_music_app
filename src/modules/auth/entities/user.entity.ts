import { Auth } from 'src/commons/classes/auth';
import { Role } from 'src/commons/enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, JoinColumn, OneToMany, BaseEntity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from 'src/modules/profile/profile.entity';
import { Playlist } from 'src/modules/playlist/playlist.entity';

@Entity('users')
@Unique(['username', 'email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({
        nullable: true,
    })
    password: string;

    @Column()
    email: string;

    @Column({
        nullable: true,
    })
    salt: string;

    @Column({
        type: 'enum',
        enum: Role,
        array: true,
    })
    roles: Role[];

    @Column('simple-json')
    auth: Auth;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    @OneToOne(type => Profile, profile => profile.user)
    @JoinColumn()
    profile: Profile;

    @OneToMany(type => Playlist, playlist => playlist.user, {
        eager: true,
    })
    playlists: Playlist[];


    // Foreign Key
    @Column()
    profileId: number;
}