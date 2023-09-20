import { ChannelType } from "@backend/typeorm/channel.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ChannelCreatedTO {
	@ApiProperty()
	chat_name: string;

	@ApiProperty()
	chanel_owner: number;

	@ApiProperty({default: null})
	password: string;

	@ApiProperty({default: null})
	max_users: number;

	@ApiProperty({default: ChannelType.PUBLIC})
	chanel_type: ChannelType;
}