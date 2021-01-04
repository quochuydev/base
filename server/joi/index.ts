export * from './schemas/object-id-schema';
export * from './schemas/standard-pagination-schema';

import Joi from './joi';

const JoiCharSchema = Joi.string().max(255);

export { JoiCharSchema };

export default Joi;
