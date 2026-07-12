import { IsEmail, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({example: ''})
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiProperty({example: ''})
    @IsEmail()
    email: string;

    @ApiProperty({example: ''})
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;
}

export class LoginDto {
    @ApiProperty({example: ''})
    @IsEmail()
    email: string;

    @ApiProperty({example: ''})
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty({example: ''})
    @IsString()
    refreshToken: string;
}

export class UpdatePasswordDto {
    @ApiProperty({example: '', description: 'The current password of the user'})
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    oldPassword: string;

    @ApiProperty({example: '', description: 'The new password for the user-minimum 8 characters'})
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    newPassword: string;

    @ApiProperty({example: '', description: 'Confirmation of the new password'})
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    confirmPassword: string;
}

