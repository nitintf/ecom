import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class MessageOptionsDto {
  @IsOptional()
  @IsBoolean()
  persistent?: boolean;

  @IsOptional()
  @IsUUID()
  messageId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  priority?: number;

  @IsOptional()
  @IsUUID()
  correlationId?: string;

  @IsOptional()
  @IsString()
  replyTo?: string;

  @IsOptional()
  @IsNumber()
  expiration?: number;

  @IsOptional()
  @IsNumber()
  timestamp?: number;

  @IsOptional()
  @IsObject()
  headers?: Record<string, any>;
}
