import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { Region } from '@prisma/client';
import { CreateRegionDto } from './dtos';
import { UpdateRegionRequest } from './interfaces';

@ApiTags('Region')
@Controller({
  path: 'region',
  version: '1.0',
})
export class RegionController {
  #_service: RegionService;

  constructor(service: RegionService) {
    this.#_service = service;
  }

  @Get()
  async getRegionList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Region[]> {
    return await this.#_service.getRegionList(languageCode);
  }

  @Post('add')
  async createRegion(@Body() payload: CreateRegionDto): Promise<void> {
    await this.#_service.createRegion(payload);
  }

  @Patch('edit/:id')
  async updateLanguage(
    @Body() payload: UpdateRegionRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.#_service.updateRegion({ id, ...payload });
  }

  @Delete('delete/:id')
  async deleteRegion(@Param('id') id: number): Promise<void> {
    await this.#_service.deleteRegion(id);
  }
}
