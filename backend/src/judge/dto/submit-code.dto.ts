import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class SubmitCodeDto {
  @IsNotEmpty()
  problemId: number;

  @IsString()
  @IsIn(['js', 'py'])
  language: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
