import Joi from 'joi';

export class PolygonValidator {
  static poligonoValidator = Joi.object({
    type: Joi.string().valid('FeatureCollection', 'Feature', 'Polygon', 'MultiPolygon').required(),
    features: Joi.array().items(Joi.object()).optional(),
    geometry: Joi.object().optional(),
    coordinates: Joi.array().optional(),
  }).unknown(true);

  static idParamValidator = Joi.object({
    id: Joi.number().integer().positive().required(),
  });

  static buscarPoligonosValidator = Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    raio: Joi.number().positive().required(),
  });
}