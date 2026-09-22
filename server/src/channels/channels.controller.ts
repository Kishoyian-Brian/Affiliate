import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { TestChannelDto } from './dto/test-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channels')
@Roles(Role.Admin)
export class ChannelsController {
  constructor(private readonly channels: ChannelsService) {}

  @Get()
  findAll() {
    return this.channels.findAll();
  }

  @Post()
  create(@Body() dto: CreateChannelDto) {
    return this.channels.create(dto);
  }

  @Post('test-bot')
  testBot(@Body() dto: TestChannelDto) {
    return this.channels.testBot(dto.username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.channels.update(id, dto);
  }
}
