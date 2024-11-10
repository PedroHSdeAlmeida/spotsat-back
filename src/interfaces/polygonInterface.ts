export type IGeometria = GeoJSON.Geometry;

export interface IPoligono {
    geometria: IGeometria;
    centroide: object;
    areaHectares: number;
    usuarioId: number;
}