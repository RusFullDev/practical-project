import { CreateLanguageRequest, UpdateLanguageRequest } from './interfaces';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language } from '@prisma/client';
import { isUUID } from 'class-validator';
import { FilesService } from '../file/file.service';

@Injectable()
export class LanguageService {
  #_prisma: PrismaService;
  #_files: FilesService;

  constructor(prisma: PrismaService, file: FilesService) {
    this.#_prisma = prisma;
    this.#_files = file
  }

  async createLanguage(payload: CreateLanguageRequest): Promise<void> {
    await this.#_checkExistingLanguage(payload.code);
    const file = await this.#_files.createFile(payload.image);
    await this.#_prisma.language.create({
      data: {
        code: payload.code,
        title: payload.title,
        image_url: `http://localhost:3003/api/uploads/${file}`,
      },
    });
  }

  async getLanguageList(): Promise<Language[]> {
    return await this.#_prisma.language.findMany();
  }

  async updateLanguage(payload: UpdateLanguageRequest): Promise<void> {
    await this.#_checkLanguage(payload.id);
    const foundedImage = await this.#_prisma.language.findFirst({
      where: { id: payload.id },
    });

    // if (payload.image) {
    //   await this.#_minio
    //     .removeFile({ fileName: foundedImage.image_url })
    //     .catch((undefined) => undefined);
    //   const file = await this.#_minio.uploadFile({
    //     file: payload.image,
    //     bucket: 'demo',
    //   });
      // await this.#_prisma.language.update({
      //   where: { id: payload.id },
      //   data: { image_url: file.fileName },
      // });
    // }

    if (payload.title) {
      await this.#_prisma.language.update({
        data: { title: payload.title },
        where: { id: payload.id },
      });
    }
  }

  async deleteLanguage(id: string): Promise<void> {
    await this.#_checkLanguage(id);
    const deletedImage = await this.#_prisma.language.findFirst({
      where: { id: id },
    });

    // await this.#_minio
    //   .removeFile({ fileName: deletedImage.image_url })
    //   .catch((undefined) => undefined);

    await this.#_prisma.language.delete({ where: { id } });
  }

  async #_checkExistingLanguage(code: string): Promise<void> {
    const language = await this.#_prisma.language.findFirst({
      where: {
        code,
      },
    });

    if (language) {
      throw new ConflictException(`${language.title} is already available`);
    }
  }

  async #_checkLanguage(id: string): Promise<void> {
    const language = await this.#_prisma.language.findFirst({
      where: {
        id,
      },
    });

    if (!language) {
      throw new ConflictException(`Language with ${id} is not exists`);
    }
  }
}
