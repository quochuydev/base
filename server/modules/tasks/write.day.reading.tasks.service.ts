import { Injectable } from '@nestjs/common';
import { InjectModel } from '@blog/server/utils/model.util';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleModel, IArticleModel } from '@blog/server/models/article.model';

import LRU from 'lru-cache';
const cache = new LRU();

export const incArticleDayReadingCount = (articleId: string, dayReadingsLen: number) => {
    if (dayReadingsLen >= 14) {
        return;
    }
    const curDayTime = new Date(new Date().toLocaleDateString()).getTime();
    const key = articleId + '#' + curDayTime;
    const count = cache.get(key) as number;
    if (count) {
        cache.set(key, count + 1);
    } else {
        cache.set(key, 1);
    }
};

@Injectable()
export class WriteDayReadingTasksService {
    isInserting = false;

    constructor(@InjectModel(ArticleModel) private readonly articleModel: IArticleModel) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    timingWrite() {
        if (this.isInserting) {
            return;
        }
        this.isInserting = true;
        Promise.all(
            cache.keys().map(async (key: string) => {
                return await this.writeToDb(key);
            })
        ).then(() => {
            this.isInserting = false;
        });
    }

    async writeToDb(key: string) {
        const [articleId, timestamp] = key.split('#');

        const count = cache.get(key) as number;

        const res = await this.articleModel.update(
            { _id: articleId, 'dayReadings.timestamp': timestamp },
            { $inc: { 'dayReadings.$.count': count } }
        );

        if (res.n <= 0) {
            await this.articleModel.updateOne(
                { _id: articleId },
                { $addToSet: { dayReadings: { timestamp: Number(timestamp), count } } }
            );
        }

        const result = (cache.get(key) as number) - count;
        if (result <= 0) {
            cache.del(key);
        } else {
            cache.set(key, result);
        }
    }
}
