import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { JwtModule } from '@nestjs/jwt';
import { EmailVerification } from './entities/email-verification.entity';
import { JwtStrategy } from './stratigies/jwt-strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ForgottenPassword } from './entities/forgotten-password.entity';
import { ProfileModule } from '../profile/profile.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { ChatModule } from 'src/shared/chat/chat.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository, EmailVerification, ForgottenPassword]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
        JwtModule.register({
            secret: AuthConstants.secretKey,
            signOptions: {
                expiresIn: AuthConstants.expiresIn,
            },
        }),
        ProfileModule,
        FavoriteModule,
        PlaylistModule,
        forwardRef(() => ChatModule),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtStrategy, JwtModule, PassportModule, AuthService],
})
export class AuthModule { }
