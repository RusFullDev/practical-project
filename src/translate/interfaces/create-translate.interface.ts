import { TranslateType } from "@prisma/client";

export declare interface CreateTranslateInterface {
  code: string;
  type: TranslateType;
  definition: Record<string, string>
}