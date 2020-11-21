import { MONGODB } from '../server/configs/index.config';
import mongoose from 'mongoose';
import { getCategory, getArticle, getComment, getFile } from '../test/faker';
import { CategoryModel, ArticleModel, CommentModel, FileModel } from '../test/models';

const init = async () => {
    try {
        const conn = await mongoose.connect(MONGODB.uri, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        // await conn.connection.dropDatabase();

        let categories = [];
        for (let i = 0; i < 10; i++) {
            categories.push(getCategory());
        }
        await CategoryModel.create(categories);

        categories = await CategoryModel.find({});

        let articles = [];
        for (let i = 0; i < 50; i++) {
            articles.push(getArticle({ category: categories[0]._id }));
        }
        await ArticleModel.create(articles);

        articles = await ArticleModel.find({});
        const comments = [];
        for (let i = 0; i < 50; i++) {
            comments.push(
                getComment({
                    article: articles[0]._id,
                })
            );
        }
        await CommentModel.create(comments);

        const files = [];
        for (let i = 0; i < 50; i++) {
            files.push(getFile());
        }
        await FileModel.create(files);
    } catch (error) {
        console.log(error);
    }

    process.exit(0);
};

init();
