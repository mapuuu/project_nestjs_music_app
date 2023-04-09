import { Gender } from "src/commons/enums/gender.enum";
import { IsInt, Min, Max, IsString, IsIn } from "class-validator";

export class CreateProfileDto {

  @IsString()
  firstName: string;

  lastName: string;

  @IsInt()
  @Min(5, {
    message: 'min length of age is 5 years',
  })
  @Max(99, {
    message: 'max length of age is 99 years'
  })
  age: number;

  phone: string;

  @IsIn([Gender.MALE, Gender.FEMALE])
  gender: Gender;

  country: string;

  city: string;

  address: string;
}
