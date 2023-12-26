import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  limit = 100;

  @IsOptional()
  @IsPositive()
  page = 1;
}
