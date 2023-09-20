import { ApiProperty } from "@nestjs/swagger";

export class UpdateChannelDto {
	@ApiProperty({default: null})
	chat_name: string;

	@ApiProperty({default: null})
	password: string;

	@ApiProperty({default: null})
	max_users: number;
}