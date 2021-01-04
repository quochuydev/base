import { join } from 'path';
import fs from 'fs';
import util from 'util';
import { publicPath, getUploadPathWithYear } from './path.util';
const writeFile = util.promisify(fs.writeFile);

export const creteUploadFile = async (fileName: string, fileBuffer: Buffer) => {
    const _uploadPath = getUploadPathWithYear();
    const basePath = join(publicPath, _uploadPath);
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath);
    }
    await writeFile(basePath + '/' + fileName, fileBuffer);
    const url = _uploadPath + '/' + fileName;
    return url;
};
