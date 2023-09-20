import { User } from "@backend/typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class ReturnChanelDto {
	@ApiProperty()
	chat_id: number;

	@ApiProperty()
	chat_name: string;

	@ApiProperty()
	creationDate: Date;

	@ApiProperty({default: null})
	max_users: number;

	@Exclude() // Исключаем поле password из сериализации
	password: string;
	
	@Exclude()
	chanel_owner: User;

	@Exclude()
	chat_users: User[];

	@Exclude()
	chat_admins: User[];
}