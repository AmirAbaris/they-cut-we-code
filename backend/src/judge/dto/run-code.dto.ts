import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class RunCodeDto {
  @IsNotEmpty()
  problemId: number;

  @IsString()
  @IsIn(['js', 'py'])
  language: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
