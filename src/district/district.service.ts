import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { District, Region } from '@prisma/client';
  import { PrismaService } from '../prisma/prisma.service';
  import { TranslateService } from '../translate/translate.service';
import { CreateDistrictRequest, UpdateDistrictRequest } from './interfaces';
  
  @Injectable()
  export class DistrictService {
    #_prisma: PrismaService;
    #_service: TranslateService
    
    constructor(prisma: PrismaService, service: TranslateService) {
        this.#_prisma = prisma;
        this.#_service = service
    }
  
    async createDistrict(payload: CreateDistrictRequest): Promise<void> {
      await this.#_checkRegion(payload.region_id);
      await this.#_checkTranslate(payload.name)
  
      await this.#_prisma.district.create({
        data: {
          name: payload.name,
          region_id: payload.region_id
        },
      });
    }
  
    async getDistrictList(languageCode:string): Promise<District[]> {
      const data =  await this.#_prisma.district.findMany();
      const result = []
      for (const x of data) {
          const name_request = {
            translateId: x.name,
            languageCode: languageCode,
          };
          const translated_title = await this.#_service.getSingleTranslate(name_request);
          result.push({id: x.id, name: translated_title.value, region_id: x.region_id})
      }
      return result
    }
  
    async updateDistrict(payload: UpdateDistrictRequest): Promise<void> {
      await this.#_checkRegion(payload.id);
      await this.#_checkDistrict(payload.id);
      const foundedDistrict = await this.#_prisma.region.findFirst({
        where: { id: payload.id },
      });

      if (payload.name) {
        await this.#_prisma.district.update({
          data: { name: payload.name },
          where: { id: payload.id },
        });
      }
    }
  
    async deleteDistrict(id: number): Promise<void> {
      await this.#_checkDistrict(id);
      const deletedDistrict = await this.#_prisma.district.findFirst({
        where: { id: id },
      });
  
      await this.#_prisma.region.delete({ where: { id } });
    }
  
    async #_checkDistrict(id: number): Promise<void> {
      const district = await this.#_prisma.district.findFirst({
        where: {
          id: Number(id),
        },
      });
  
      if (!district) {
        throw new ConflictException(`District with ${id} is not exists`);
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
  
    async #_checkTranslate(id: number): Promise<void> {
      const translate = await this.#_prisma.translate.findFirst({
        where: { id },
      });
  
      if (!translate) throw new NotFoundException('Translate not found');
    }
  }
  