import { LanguageService } from './language.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateLanguageDto, UpdateLanguageDto } from './dtos';
import { Language } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Language')
@Controller({
  path: 'language',
  version: '1.0',
})
export class LanguageController {
  #_service: LanguageService;

  constructor(service: LanguageService) {
    this.#_service = service;
  }

  @Get()
  async getLanguageList(): Promise<Language[]> {
    return await this.#_service.getLanguageList();
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post('add')
  async createLanguage(
    @Body() payload: CreateLanguageDto,
    @UploadedFile() image: any,
  ): Promise<void> {
    await this.#_service.createLanguage({ ...payload, image });
  }

  @ApiConsumes('multipart/form-data')
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateLanguage(
    @Body() payload: UpdateLanguageDto,
    @Param('id') id: string,
    @UploadedFile() image: any,
  ): Promise<void> {
    await this.#_service.updateLanguage({ id, ...payload, image });
  }

  @Delete('delete/:id')
  async deleteLanguage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteLanguage(id);
  }
}
