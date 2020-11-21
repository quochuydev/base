import dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommentModel, ICommentModel } from '@blog/server/models/comment.model';
import { InjectModel } from '@blog/server/utils/model.util';
import { EmailService } from '@blog/server/modules/email/email.service';

@Injectable()
export class HasNewCommentTasksService {
    constructor(
        @InjectModel(CommentModel) private readonly commentModel: ICommentModel,
        private readonly emailService: EmailService
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_9PM)
    async HasNewComment() {
        if (this.emailService.isEnableSmtp) {
            const count = await this.commentModel.countDocuments({
                createdAt: { $gte: dayjs().format('YYYY-MM-DD') },
            });
            if (count < 1) {
                return;
            }
            this.emailService.sendMail({
                subject: `博客有 ${count} 条新的`,
                text: '博客有新的要处理。',
            });
        }
    }
}
