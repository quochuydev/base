import { Inject } from '@nestjs/common';

const DB_MODEL_TOKEN_SUFFIX = 'db_model_token';

export function getModelToken(modelName: string): string {
    return modelName + DB_MODEL_TOKEN_SUFFIX;
}

export const getProviderByModel = (model: any) => {
    return {
        provide: model.modelName + DB_MODEL_TOKEN_SUFFIX,
        useValue: model,
    };
};

export const InjectModel = (model: any) => {
    return Inject(getModelToken(model.modelName));
};
