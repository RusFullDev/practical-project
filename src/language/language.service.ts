import { CreateLanguageRequest, UpdateLanguageRequest } from './interfaces';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class LanguageService {
  #_prisma: PrismaService;
  #_files: CloudinaryService;

  constructor(prisma: PrismaService, file: CloudinaryService) {
    this.#_prisma = prisma;
    this.#_files = file;
  }

  async createLanguage(payload: CreateLanguageRequest): Promise<void> {
    await this.#_checkExistingLanguage(payload.code);
    const file = await (await this.#_files.uploadImage(payload.image)).url;
    await this.#_prisma.language.create({
      data: {
        code: payload.code,
        title: payload.title,
        image_url: file,
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