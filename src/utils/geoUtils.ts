import { Geometry, Point, Polygon, GeoJSON } from 'geojson';
import * as turf from '@turf/turf';
import proj4 from 'proj4';

proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs('EPSG:5880', '+proj=utm +zone=22 +south +datum=SIRGAS2000 +units=m +no_defs');

export class GeoUtils {
  private static isPolygon(geom: Geometry): geom is Polygon {
    return geom.type === 'Polygon';
  }

  private static isPoint(geom: Geometry): geom is Point {
    return geom.type === 'Point';
  }

  public static transformarGeometria(geometria: Geometry): Geometry {
    let geometriaTransformada: Geometry;

    if (GeoUtils.isPolygon(geometria)) {
      const novasCoordenadas = geometria.coordinates.map((anel) =>
        anel.map(([lon, lat]) => {
          const [x, y] = proj4('EPSG:4326', 'EPSG:5880', [lon, lat]);
          return [x, y];
        })
      );
      geometriaTransformada = {
        type: 'Polygon',
        coordinates: novasCoordenadas,
      };
    } else if (GeoUtils.isPoint(geometria)) {
      const [lon, lat] = geometria.coordinates;
      const [x, y] = proj4('EPSG:4326', 'EPSG:5880', [lon, lat]);
      geometriaTransformada = {
        type: 'Point',
        coordinates: [x, y],
      };
    } else {
      throw new Error(`Tipo de geometria não suportado: ${geometria.type}`);
    }

    (geometriaTransformada as any).crs = {
      type: 'name',
      properties: {
        name: 'EPSG:5880',
      },
    };

    return geometriaTransformada;
  }

  public static transformarGeometriaParaEPSG4326(geometria: Geometry): Geometry {
    let geometriaTransformada: Geometry;

    if (GeoUtils.isPolygon(geometria)) {
      const novasCoordenadas = geometria.coordinates.map((anel) =>
        anel.map(([x, y]) => {
          const [lon, lat] = proj4('EPSG:5880', 'EPSG:4326', [x, y]);
          return [lon, lat];
        })
      );
      geometriaTransformada = {
        type: 'Polygon',
        coordinates: novasCoordenadas,
      };
    } else if (GeoUtils.isPoint(geometria)) {
      const [x, y] = geometria.coordinates;
      const [lon, lat] = proj4('EPSG:5880', 'EPSG:4326', [x, y]);
      geometriaTransformada = {
        type: 'Point',
        coordinates: [lon, lat],
      };
    } else {
      throw new Error(`Tipo de geometria não suportado: ${geometria.type}`);
    }

    return geometriaTransformada;
  }

  public static calcularCentroide(geometria: Geometry): Point {
    const centroide = turf.centroid(geometria);
    return centroide.geometry;
  }

  public static calcularArea(geometria: Geometry): number {
    const area = turf.area(geometria) / 10000;
    return area;
  }

  public static extractGeometryFromGeoJSON(geojson: GeoJSON): Geometry {
    if (geojson.type === 'FeatureCollection' && geojson.features.length > 0) {
      return geojson.features[0].geometry;
    } else if (geojson.type === 'Feature' && geojson.geometry) {
      return geojson.geometry;
    } else if (geojson.type === 'Polygon' || geojson.type === 'MultiPolygon') {
      return geojson as Geometry;
    } else {
      throw new Error('Tipo de geometria não suportado.');
    }
  }
}
