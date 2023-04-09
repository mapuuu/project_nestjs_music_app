import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { JwtModule } from '@nestjs/jwt';
import { EmailVerification } from './entities/email-verification.entity';
import { JwtStrategy } from './stratigies/jwt-strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository, EmailVerification]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategies
        }),
        JwtModule.register({
            secret: AuthConstants.secretKey,
            signOptions: {
                expiresIn: AuthConstants.expiresIn,
            },
        }),
    ],
    providers: [JwtStrategy],
    controllers: [],
    exports: [JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule { }
