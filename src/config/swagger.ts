import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';
import { Router } from 'express';

import { JsonObject } from 'swagger-ui-express';

const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yml', 'utf8')) as JsonObject;

export const swaggerRouter = Router();
swaggerRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));