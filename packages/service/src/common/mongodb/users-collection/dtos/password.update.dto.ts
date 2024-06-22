import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PasswordUpdateDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsNumber()
    tokenVersion: number;
}
