import { 
    Injectable,
    HttpStatus, 
    HttpException,
} from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as uuid from  'uuid';

@Injectable()
export class FilesService {
    async createFile(file: any) {
        try {
          const fileName = uuid.v4() + '.jpg';
          const filePath = path.resolve(process.cwd(), 'uploads');
          
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
          }
      
          fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      
          return fileName;
        } catch (error) {
          throw new HttpException('ERROR WRITING FILE', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
}