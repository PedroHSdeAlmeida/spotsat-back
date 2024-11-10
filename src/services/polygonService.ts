import { Poligono } from '../model';
import { GeoUtils } from '../utils';
import { Geometry, Point } from 'geojson';
import { IPoligono } from '../interfaces';
import { sequelize } from '../config';

export class PoligonoService {
  static async criarPoligono(geometria: Geometry, usuarioId: number): Promise<Poligono> {
    const centroide = GeoUtils.calcularCentroide(geometria);
    const areaHectares = GeoUtils.calcularArea(geometria);

    const geometriaTransformada = GeoUtils.transformarGeometria(geometria);
    const centroideTransformado = GeoUtils.transformarGeometria(centroide);

    const poligono = await Poligono.create({
      geometria: geometriaTransformada,
      centroide: centroideTransformado,
      areaHectares,
      usuarioId,
    });

    return poligono;
  }

  static async listarPoligonos(): Promise<IPoligono[]> {
    const poligonos = await Poligono.findAll({ order: [['createdAt', 'DESC']] });
    return poligonos.map(poligono => ({
      geometria: GeoUtils.transformarGeometriaParaEPSG4326(poligono.geometria as GeoJSON.Geometry),
      centroide: GeoUtils.transformarGeometriaParaEPSG4326(poligono.centroide),
      areaHectares: poligono.areaHectares,
      usuarioId: poligono.usuarioId,
      id: poligono.id,
      criacao: poligono.createdAt,
    }));
  }

  static async obterPoligonoPorId(id: number): Promise<IPoligono | null> {
    const poligono = await Poligono.findByPk(id);
    if (!poligono) {
      return null;
    }
    return {
      geometria: GeoUtils.transformarGeometriaParaEPSG4326(poligono.geometria as GeoJSON.Geometry),
      centroide: GeoUtils.transformarGeometriaParaEPSG4326(poligono.centroide),
      areaHectares: poligono.areaHectares,
      usuarioId: poligono.usuarioId,
    };
  }

  static async obterPoligonosDentroDoPoligono(id: number): Promise<IPoligono[]> {
    const poligonoReferencia = await Poligono.findByPk(id);
    if (!poligonoReferencia) {
      throw new Error('Polígono de referência não encontrado.');
    }

    const poligonos = await Poligono.findAll({
      where: sequelize.where(
        sequelize.fn(
          'ST_Within',
          sequelize.col('geometria'),
          sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(poligonoReferencia.geometria))
        ),
        true
      ),
    });

    return poligonos.map(poligono => ({
      geometria: GeoUtils.transformarGeometriaParaEPSG4326(poligono.geometria as GeoJSON.Geometry),
      centroide: GeoUtils.transformarGeometriaParaEPSG4326(poligono.centroide),
      areaHectares: poligono.areaHectares,
      usuarioId: poligono.usuarioId,
    }));
  }

  static async buscarPoligonosPorLocalizacao(latitude: number, longitude: number, raio: number): Promise<IPoligono[]> {
    const ponto: Point = { type: 'Point', coordinates: [longitude, latitude] };
    const pontoTransformado = GeoUtils.transformarGeometria(ponto);

    const raioKm = raio * 1000;

    const circulo = sequelize.literal(
      `ST_Buffer(ST_GeomFromGeoJSON('${JSON.stringify(pontoTransformado)}'), ${raioKm})`
    );

    const poligonos = await Poligono.findAll({
      where: sequelize.where(
        sequelize.fn('ST_Intersects', sequelize.col('geometria'), circulo),
        true
      ),
    });

    return poligonos.map(poligono => ({
      geometria: GeoUtils.transformarGeometriaParaEPSG4326(poligono.geometria as GeoJSON.Geometry),
      centroide: GeoUtils.transformarGeometriaParaEPSG4326(poligono.centroide),
      areaHectares: poligono.areaHectares,
      usuarioId: poligono.usuarioId,
      id: poligono.id,
    }));
  }

  static async atualizarPoligono(id: number, geometria: Geometry, usuarioId: number): Promise<Poligono | null> {
    const poligono = await Poligono.findByPk(id);
    if (!poligono) {
      return null;
    }

    const centroide = GeoUtils.calcularCentroide(geometria);
    const areaHectares = GeoUtils.calcularArea(geometria);

    const geometriaTransformada = GeoUtils.transformarGeometria(geometria);
    const centroideTransformado = GeoUtils.transformarGeometria(centroide);

    poligono.geometria = geometriaTransformada;
    poligono.centroide = centroideTransformado;
    poligono.areaHectares = areaHectares;
    poligono.usuarioId = usuarioId;

    await poligono.save();

    return poligono;
  }

  static async deletarPoligono(id: number): Promise<boolean> {
    const poligono = await Poligono.findByPk(id);
    if (!poligono) {
      return false;
    }

    await poligono.destroy();
    return true;
  }
}