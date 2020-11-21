import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '../../utils/model.util';
import { TOKEN_SECRET_KEY } from '../../configs/index.config';
import { decrypt, getDerivedKey } from '../../utils/crypto.util';
import { UserDocument, UserModel, UserJoiSchema } from '../../models/user.model';
import { AdminLogService } from '../adminlog/adminlog.service';
import userDefaultData from '@blog/server/configs/user.default.config';

@Injectable()
export class LoginService {
    constructor(
        private readonly adminLogService: AdminLogService,
        @InjectModel(UserModel) private readonly userModel: Model<UserDocument>
    ) {}

    async getFirstLoginInfo() {
        const count = await this.userModel.countDocuments({});
        if (count <= 0) {
            return {
                message: 'count 0',
            };
        }
        return '';
    }

    async login(data) {
        const U = JSON.parse(decrypt(data.key));
        const userName = U.userName;
        const account = U.account;
        const password = U.password;
        const count = await this.userModel.countDocuments({});
        const result = Joi.object(UserJoiSchema).validate(U);
        if (count <= 0) {
            if (result.error) {
                throw new BadRequestException('BadRequestException' + result.error.message);
            }
            const user = await this.userModel.create({
                userName,
                account,
                avatar: userDefaultData.avatar,
                password: getDerivedKey(password),
            });
            return {
                userName: user.userName,
                avatar: user.avatar,
                email: user.email,
                account,
                token: jwt.sign({ account, roles: ['admin'] }, TOKEN_SECRET_KEY, {
                    expiresIn: 60 * 60,
                }),
            };
        }
        const user = await this.userModel.findOne({
            account,
            password: getDerivedKey(password),
        });
        if (user) {
            this.adminLogService.create({
                data: `${user.account} `,
                type: 'create',
                user: user._id,
            });
            return {
                userName: user.userName,
                avatar: user.avatar,
                email: user.email,
                account,
                token: jwt.sign({ account, roles: ['admin'] }, TOKEN_SECRET_KEY, {
                    expiresIn: 60 * 60,
                }),
            };
        }
        throw new BadRequestException('login');
    }
}
