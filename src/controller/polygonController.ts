import { RequestHandler, Request } from 'express';
import { PoligonoService } from '../services';
import { PolygonValidator } from './validators';
import { Geometry, GeoJSON } from 'geojson';
import { GeoUtils } from '../utils';
import { BadRequestError, NotFoundError, InternalServerError } from '../errors';

export class PoligonoController {
  
  static criarPoligono: RequestHandler = async (req, res, next) => {
    const { error } = PolygonValidator.poligonoValidator.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details.map(detail => detail.message).join(', ')));
    }
    let geometria: Geometry;
    try {
      geometria = GeoUtils.extractGeometryFromGeoJSON(req.body as GeoJSON);
    } catch (err) {
      return next(new BadRequestError(err instanceof Error ? err.message : 'Erro desconhecido ao extrair geometria.'));
    }
    try {
      const poligono = await PoligonoService.criarPoligono(geometria, req.usuario.id);
      res.status(201).json(poligono);
    } catch (error) {
      console.error('Erro ao criar o polígono:', error);
      return next(new InternalServerError('Erro ao criar o polígono.'));
    }
  };

  static listarPoligonos: RequestHandler = async (req, res, next) => {
    try {
      const poligonos = await PoligonoService.listarPoligonos();
      res.status(200).json(poligonos);
    } catch (error) {
      console.error('Erro ao listar os polígonos:', error);
      return next(new InternalServerError('Erro ao listar os polígonos.'));
    }
  };

  static obterPoligono: RequestHandler = async (req, res, next) => {
    const { error } = PolygonValidator.idParamValidator.validate(req.params);
    if (error) {
      return next(new BadRequestError(error.details.map(detail => detail.message).join(', ')));
    }

    const { id } = req.params;

    try {
      const poligono = await PoligonoService.obterPoligonoPorId(Number(id));

      if (!poligono) {
        return next(new NotFoundError('Polígono não encontrado.'));
      }

      res.status(200).json(poligono);
    } catch (error) {
      console.error('Erro ao obter o polígono:', error);
      return next(new InternalServerError('Erro ao obter o polígono.'));
    }
  };

  static obterPoligonosDentroDoPoligono: RequestHandler = async (req, res, next) => {
    const { error } = PolygonValidator.idParamValidator.validate(req.params);
    if (error) {
      return next(new BadRequestError(error.details.map(detail => detail.message).join(', ')));
    }

    const { id } = req.params;

    try {
      const poligonos = await PoligonoService.obterPoligonosDentroDoPoligono(Number(id));

      res.status(200).json(poligonos);
    } catch (error) {
      console.error('Erro ao obter os polígonos dentro do polígono:', error);
      return next(new InternalServerError('Erro ao obter os polígonos dentro do polígono.'));
    }
  };

  static buscarPoligonos: RequestHandler = async (req, res, next) => {
    const { error } = PolygonValidator.buscarPoligonosValidator.validate(req.query);
    if (error) {
      return next(new BadRequestError(error.details.map(detail => detail.message).join(', ')));
    }

    const { latitude, longitude, raio } = req.query;

    try {
      const poligonos = await PoligonoService.buscarPoligonosPorLocalizacao(
        Number(latitude),
        Number(longitude),
        Number(raio)
      );

      res.status(200).json(poligonos);
    } catch (error) {
      console.error('Erro ao buscar polígonos:', error);
      return next(new InternalServerError('Erro ao buscar polígonos.'));
    }
  };

  static atualizarPoligono: RequestHandler = async (req, res, next) => {
    const errorParams = PolygonValidator.idParamValidator.validate(req.params).error;
    const errorBody = PolygonValidator.poligonoValidator.validate(req.body).error;

    if (errorParams) {
      return next(new BadRequestError(errorParams.details.map(detail => detail.message).join(', ')));
    }
    if (errorBody) {
      return next(new BadRequestError(errorBody.details.map(detail => detail.message).join(', ')));
    }

    const { id } = req.params;
    let geometria: Geometry;
    try {
      geometria = GeoUtils.extractGeometryFromGeoJSON(req.body as GeoJSON);
    } catch (err) {
      return next(new BadRequestError(err instanceof Error ? err.message : 'Erro desconhecido ao extrair geometria.'));
    }

    try {
      const poligonoAtualizado = await PoligonoService.atualizarPoligono(
        Number(id),
        geometria,
        req.usuario.id
      );

      if (!poligonoAtualizado) {
        return next(new NotFoundError('Polígono não encontrado.'));
      }

      res.status(200).json(poligonoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar o polígono:', error);
      return next(new InternalServerError('Erro ao atualizar o polígono.'));
    }
  };

  static deletarPoligono: RequestHandler = async (req, res, next) => {
    const { error } = PolygonValidator.idParamValidator.validate(req.params);
    if (error) {
      return next(new BadRequestError(error.details.map(detail => detail.message).join(', ')));
    }

    const { id } = req.params;

    try {
      const sucesso = await PoligonoService.deletarPoligono(Number(id));

      if (!sucesso) {
        return next(new NotFoundError('Polígono não encontrado.'));
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar o polígono:', error);
      return next(new InternalServerError('Erro ao deletar o polígono.'));
    }
  };
}