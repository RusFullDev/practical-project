import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Region } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TranslateService } from '../translate/translate.service';
import { CreateRegionRequest, UpdateRegionRequest } from './interfaces';

@Injectable()
export class RegionService {
  #_prisma: PrismaService;
  #_service: TranslateService
  
  constructor(prisma: PrismaService, service: TranslateService) {
      this.#_prisma = prisma;
      this.#_service = service
  }

  async createRegion(payload: CreateRegionRequest): Promise<void> {
    await this.#_checkExistingRegion(payload.name);
    await this.#_checkTranslate(payload.name)

    await this.#_prisma.region.create({
      data: {
        name: payload.name
      },
    });
  }

  async getRegionList(languageCode:string): Promise<Region[]> {
    const data =  await this.#_prisma.region.findMany();
    const result = []
    for (const x of data) {
        const name_request = {
          translateId: x.name.toString(),
          languageCode: languageCode,
        };
        const translated_title = await this.#_service.getSingleTranslate(name_request);
        result.push({id: x.id, name: translated_title.value})
    }
    return result
  }

  async updateRegion(payload: UpdateRegionRequest): Promise<void> {
    await this.#_checkRegion(payload.id);
    const foundedImage = await this.#_prisma.region.findFirst({
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

    if (payload.name) {
      await this.#_prisma.region.update({
        data: { name: payload.name },
        where: { id: payload.id },
      });
    }
  }

  async deleteRegion(id: number): Promise<void> {
    await this.#_checkRegion(id);
    const deletedImage = await this.#_prisma.region.findFirst({
      where: { id: id },
    });

    // await this.#_minio
    //   .removeFile({ fileName: deletedImage.image_url })
    //   .catch((undefined) => undefined);

    await this.#_prisma.region.delete({ where: { id } });
  }

  async #_checkExistingRegion(name: string): Promise<void> {
    const region = await this.#_prisma.region.findFirst({
      where: {
        name: name,
      },
    });

    if (region) {
      throw new ConflictException(`${name} is already available`);
    }
  }

  async #_checkRegion(id: number): Promise<void> {
    const region = await this.#_prisma.region.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!region) {
      throw new ConflictException(`Region with ${id} is not exists`);
    }
  }

  async #_checkTranslate(id: string): Promise<void> {
    const translate = await this.#_prisma.translate.findFirst({
      where: { id },
    });

    if (!translate) throw new NotFoundException('Translate not found');
  }
}
