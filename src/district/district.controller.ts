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
  import { District, Region } from '@prisma/client';
import { DistrictService } from './district.service';
import { CreateDistrictDto, UpdateDistrictDto } from './dtos';
  
  @ApiTags('District')
  @Controller({
    path: 'district',
    version: '1.0',
  })
  export class DistrictController {
    #_service: DistrictService;
  
    constructor(service: DistrictService) {
      this.#_service = service;
    }
  
    @Get()
    async getDistrictList(
      @Headers('accept-language') languageCode: string,
    ): Promise<District[]> {
      return await this.#_service.getDistrictList(languageCode);
    }
  
    @Post('add')
    async createDistrict(@Body() payload: CreateDistrictDto): Promise<void> {
      await this.#_service.createDistrict(payload);
    }
  
    @Patch('edit/:id')
    async updateDistrict(
      @Body() payload: UpdateDistrictDto,
      @Param('id') id: number,
    ): Promise<void> {
      await this.#_service.updateDistrict({ id, ...payload });
    }
  
    @Delete('delete/:id')
    async deleteDistrict(@Param('id') id: number): Promise<void> {
      await this.#_service.deleteDistrict(id);
    }
  }
  