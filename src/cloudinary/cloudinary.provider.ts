import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constanta';
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): void => {
    v2.config({
      cloud_name: "dc28msg2s",
      api_key: "194782588819449",
      api_secret: "5nkx7lpFXVfpb5jg1dAiyOqycSE",
    });
  },
};