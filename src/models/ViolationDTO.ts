import { IsOptional, IsString, IsNumber } from 'class-validator'

export class ViolationDTO {
    @IsOptional()
    @IsString()
    photo_uri?: string

    @IsOptional()
    @IsNumber()
    latitude?: number

    @IsOptional()
    @IsNumber()
    longitude?: number

    @IsOptional()
    @IsString()
    description?: string
}
