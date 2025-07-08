import json
import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.enums import Resampling
from shapely.geometry import shape, mapping
from pathlib import Path

# Define Chennai bounds
CHENNAI_BOUNDS = {
    'left': 80.1,
    'right': 80.4,
    'bottom': 12.8,
    'top': 13.2
}

def get_warning_message(risk_level):
    return {
        "high": "URGENT: Severe flood risk in coastal region. Immediate evacuation recommended.",
        "moderate": "WARNING: Moderate flood risk. Stay alert and prepare for possible evacuation.",
        "low": "CAUTION: Low flood risk. Monitor updates and stay safe."
    }.get(risk_level, "No data available")

def validate_coordinates(polygon, bounds):
    try:
        if not isinstance(polygon, dict) or 'coordinates' not in polygon:
            return False

        coords = polygon['coordinates'][0]
        if not coords or len(coords) < 3:
            return False

        lons = [coord[0] for coord in coords]
        lats = [coord[1] for coord in coords]

        min_lon, max_lon = min(lons), max(lons)
        min_lat, max_lat = min(lats), max(lats)

        tolerance = 0.001

        is_valid = not (
            max_lon < bounds['left'] - tolerance or
            min_lon > bounds['right'] + tolerance or
            max_lat < bounds['bottom'] - tolerance or
            min_lat > bounds['top'] + tolerance
        )

        return is_valid
    except:
        return False

def create_transform_for_chennai():
    from rasterio.transform import Affine
    width = 2342
    height = 1412
    lon_range = CHENNAI_BOUNDS['right'] - CHENNAI_BOUNDS['left']
    lat_range = CHENNAI_BOUNDS['top'] - CHENNAI_BOUNDS['bottom']
    pixel_width = lon_range / width
    pixel_height = lat_range / height
    transform = Affine(
        pixel_width, 0, CHENNAI_BOUNDS['left'],
        0, -pixel_height, CHENNAI_BOUNDS['top']
    )
    return transform

def predict_flood_zones():
    RASTER_PATH = Path("flood_model/flood_prediction_map.tif").absolute()
    if not RASTER_PATH.exists():
        return {"error": f"Flood prediction map not found at {RASTER_PATH}"}

    try:
        with rasterio.open(RASTER_PATH) as src:
            flood_mask = src.read(1).astype(np.float32)
            transform = create_transform_for_chennai()

            high_mask = flood_mask >= 200
            moderate_mask = (flood_mask >= 150) & (flood_mask < 200)
            low_mask = (flood_mask >= 100) & (flood_mask < 150)

            features = []
            feature_id = 1

            risk_levels = [
                ("high", high_mask),
                ("moderate", moderate_mask),
                ("low", low_mask)
            ]

            for risk_level, mask in risk_levels:
                if np.sum(mask) < 100:
                    continue

                for geom, val in shapes(mask.astype(np.uint8), transform=transform):
                    if val == 0:
                        continue

                    polygon = shape(geom).simplify(0.0001)

                    if not polygon.is_valid or polygon.area < 0.00001:
                        continue

                    feature = {
                        "type": "Feature",
                        "geometry": mapping(polygon),
                        "properties": {
                            "id": f"flood-zone-{risk_level}-{feature_id}",
                            "riskLevel": risk_level,
                            "probability": {"high": 85, "moderate": 60, "low": 35}[risk_level],
                            "warning": get_warning_message(risk_level)
                        }
                    }

                    if validate_coordinates(feature["geometry"], CHENNAI_BOUNDS):
                        features.append(feature)
                        feature_id += 1

            if not features:
                return {"error": "No valid flood zones found"}

            return {
                "type": "FeatureCollection",
                "features": features
            }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    result = predict_flood_zones()
    print(json.dumps(result))
