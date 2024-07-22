import { Translate } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import {
  CreateTranslateInterface,
  GetSingleTranslateRequest,
  GetSingleTranslateResponse,
  UpdateTranslateRequest,
} from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TranslateService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getTranslateList(): Promise<Translate[]> {
    return await this.#_prisma.translate.findMany({
      include: {
        definition: {
          select: {
            value: true,
            language: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async searchTranslate(payload): Promise<Translate[]> {
    const data = await this.getTranslateList();

    if (!payload.code.length || !data.length) {
      return data;
    }

    let result = [];
    for (const translate of data) {
      if (
        translate.code
          .toString()
          .toLocaleLowerCase()
          .includes(payload.code.toLocaleLowerCase())
      ) {
        result.push(translate);
      }
    }
    return result;
  }

  async getSingleTranslateByCode(code: string): Promise<Translate[]> {
    return await this.#_prisma.translate.findMany({
      where: {
        code: code,
      },
      include: {
        definition: {
          select: {
            value: true,
            language: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async createTranslate(payload: CreateTranslateInterface): Promise<number> {
    await this.#_checkExistingTranslate(payload.code);

    for (const code of Object.keys(payload.definition)) {
      await this.#_checkLanguage(code);
    }

    const translate = await this.#_prisma.translate.create({
      data: { code: payload.code, type: payload.type },
    });

    for (const item of Object.entries(payload.definition)) {
      const language = await this.#_prisma.language.findFirst({
        where: { code: item[0] },
      });

      await this.#_prisma.definition.create({
        data: {
          languageId: language.id,
          translateId: translate.id,
          value: item[1],
        },
      });
    }
    return translate.id;
  }

  async getSingleTranslate(
    payload: GetSingleTranslateRequest,
  ): Promise<GetSingleTranslateResponse> {
    await this.#_checkLanguage(payload.languageCode);
    await this.#_checkTranslate(payload.translateId);

    const language = await this.#_prisma.language.findFirst({
      where: { code: payload.languageCode },
      select: {
        id: true,
      },
    });

    const translate = await this.#_prisma.translate.findFirst({
      where: { id: payload.translateId },
      select: {
        id: true,
      },
    });

    const definition = await this.#_prisma.definition.findFirst({
      where: {
        languageId: language.id,
        translateId: translate.id,
      },
      select: {
        value: true,
      },
    });

    return {
      value: definition?.value || '',
    };
  }

  async updateTranslate(payload: UpdateTranslateRequest): Promise<void> {
    await this.#_checkTranslate(payload.id);
    const foundedTranslate = await this.#_prisma.translate.findFirst({
      where: { id: payload.id},
    });

    if (payload?.definition) {
      await this.#_prisma.definition.deleteMany({
        where: { translateId: foundedTranslate.id },
      });

      for (const item of Object.entries(payload.definition)) {
        const language = await this.#_prisma.language.findFirst({
          where: { code: item[0] },
        });

        await this.#_prisma.definition.create({
          data: {
            languageId: language.id,
            translateId: foundedTranslate.id,
            value: item[1],
          },
        });
      }
    }
  }

  async deleteTranslate(id: number) {
    await this.#_prisma.translate.update({
      where: { id: id },
      data: {
        status: 'inactive',
      },
    });
  }

  async #_checkLanguage(code: string): Promise<void> {
    const language = await this.#_prisma.language.findFirst({
      where: { code },
    });

    if (!language) throw new ConflictException(`Language ${code} not found`);
  }

  async #_checkTranslate(id: number): Promise<void> {
    const translate = await this.#_prisma.translate.findFirst({
      where: { id },
    });

    if (!translate) throw new NotFoundException('Translate not found');
  }

  async #_checkExistingTranslate(code: string): Promise<void> {
    const translate = await this.#_prisma.translate.findFirst({
      where: { code },
    });

    if (translate)
      throw new BadRequestException(`Translate ${code} is already available`);
  }
}
