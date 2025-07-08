from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.enums import Resampling
from shapely.geometry import shape, mapping, box
from pathlib import Path
import numpy.ma as ma

router = APIRouter()

# Define Chennai bounds
CHENNAI_BOUNDS = {
    'left': 80.1,    # Western longitude
    'right': 80.4,   # Eastern longitude
    'bottom': 12.8,  # Southern latitude
    'top': 13.2      # Northern latitude
}

def get_warning_message(risk_level):
    """Get warning message based on flood risk level"""
    return {
        "high": "URGENT: Severe flood risk in coastal region. Immediate evacuation recommended.",
        "moderate": "WARNING: Moderate flood risk. Stay alert and prepare for possible evacuation.",
        "low": "CAUTION: Low flood risk. Monitor updates and stay safe."
    }.get(risk_level, "No data available")

def validate_coordinates(polygon, bounds):
    """Validate that polygon coordinates are within bounds and properly formatted"""
    try:
        # Check if coordinates array is properly structured
        if not isinstance(polygon, dict) or 'coordinates' not in polygon:
            print("Invalid polygon structure")
            return False
            
        coords = polygon['coordinates'][0]  # First ring of coordinates
        if not coords or len(coords) < 3:  # Polygons need at least 3 points
            print("Polygon has insufficient points")
            return False

        # Calculate coordinate bounds
        lons = [coord[0] for coord in coords]
        lats = [coord[1] for coord in coords]
        
        min_lon, max_lon = min(lons), max(lons)
        min_lat, max_lat = min(lats), max(lats)
        
        # Add some tolerance (0.001 degrees ≈ 100m)
        tolerance = 0.001
        
        # Check if the polygon intersects with Chennai bounds
        is_valid = not (
            max_lon < bounds['left'] - tolerance or
            min_lon > bounds['right'] + tolerance or
            max_lat < bounds['bottom'] - tolerance or
            min_lat > bounds['top'] + tolerance
        )
        
        if not is_valid:
            print(f"Polygon bounds outside Chennai area:")
            print(f"Longitude: [{min_lon}, {max_lon}] (expected: [{bounds['left']}, {bounds['right']}])")
            print(f"Latitude: [{min_lat}, {max_lat}] (expected: [{bounds['bottom']}, {bounds['top']}])")
            return False
            
        return True

    except Exception as e:
        print(f"Error validating coordinates: {e}")
        return False

def process_flood_mask(mask, threshold=0.5):
    """Process flood mask and return binary mask"""
    # Normalize the mask to [0, 1] range
    normalized = (mask - mask.min()) / (mask.max() - mask.min())
    
    # Create binary mask
    return normalized >= threshold

def create_transform_for_chennai():
    """Create an affine transform to map pixel coordinates to Chennai's geographic coordinates"""
    from rasterio.transform import Affine
    
    # Calculate pixel sizes based on image dimensions and geographic bounds
    width = 2342  # Image width from flood mask
    height = 1412  # Image height from flood mask
    
    # Calculate the pixel sizes (degrees per pixel)
    lon_range = CHENNAI_BOUNDS['right'] - CHENNAI_BOUNDS['left']
    lat_range = CHENNAI_BOUNDS['top'] - CHENNAI_BOUNDS['bottom']
    
    pixel_width = lon_range / width
    pixel_height = lat_range / height
    
    # Create transform matrix that maps pixels to geographic coordinates
    # Note: we use -pixel_height because the image origin is at the top-left
    transform = Affine(
        pixel_width, 0, CHENNAI_BOUNDS['left'],  # scale_x, shear_x, offset_x
        0, -pixel_height, CHENNAI_BOUNDS['top']  # shear_y, scale_y, offset_y
    )
    
    print(f"Transform matrix: {transform}")
    
    return transform

def smooth_flood_mask(mask):
    """Apply Gaussian smoothing to preserve curved boundaries"""
    from scipy.ndimage import gaussian_filter
    return gaussian_filter(mask.astype(float), sigma=1.5)

def get_contour_shapes(mask, transform):
    """Generate shapes from flood mask using contour-based approach"""
    from scipy.ndimage import binary_fill_holes
    import cv2
    import numpy as np
    
    # Fill holes in the mask
    filled_mask = binary_fill_holes(mask).astype(np.uint8)
    
    # Find contours using OpenCV
    contours, _ = cv2.findContours(filled_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
    
    shapes_list = []
    for contour in contours:
        # Convert contour points to geographic coordinates
        geo_coords = []
        for point in contour:
            x, y = point[0][0], point[0][1]
            # Apply the transform to get geographic coordinates
            lon, lat = transform * (x, y)
            geo_coords.append((lon, lat))
            
        if len(geo_coords) >= 3:  # Need at least 3 points for a valid polygon
            # Close the polygon by adding the first point at the end
            if geo_coords[0] != geo_coords[-1]:
                geo_coords.append(geo_coords[0])
                
            shapes_list.append({
                "type": "Polygon",
                "coordinates": [geo_coords]
            })
    
    return shapes_list

@router.get("/api/flood-prediction")
async def predict_flood_zones():
    RASTER_PATH = Path("data/flood_prediction_map.tif").absolute()
    print(f"Processing flood prediction map: {RASTER_PATH}")

    if not RASTER_PATH.exists():
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": "Flood prediction map not found"}
        )

    try:
        import numpy as np
        from rasterio.features import shapes
        from shapely.ops import unary_union

        with rasterio.open(RASTER_PATH) as src:
            # Read the flood mask
            flood_mask = src.read(1).astype(np.float32)
            
            # Create proper transform for Chennai coordinates
            transform = create_transform_for_chennai()
            
            # Create binary masks for each risk level
            high_mask = flood_mask >= 200
            moderate_mask = (flood_mask >= 150) & (flood_mask < 200)
            low_mask = (flood_mask >= 100) & (flood_mask < 150)

            features = []
            feature_id = 1

            # Process each risk level
            risk_levels = [
                ("high", high_mask),
                ("moderate", moderate_mask),
                ("low", low_mask)
            ]

            print("\nProcessing flood zones:")
            for risk_level, mask in risk_levels:
                mask_count = np.sum(mask)
                print(f"\n{risk_level.upper()} risk areas:")
                print(f"Pixels in mask: {mask_count}")
                
                if mask_count < 100:  # Skip if not enough pixels
                    continue

                # Generate shapes with the correct transform
                for geom, val in shapes(mask.astype(np.uint8), transform=transform):
                    if val == 0:  # Skip areas with no risk
                        continue
                        
                    try:
                        # Convert to shapely geometry and simplify slightly
                        polygon = shape(geom).simplify(0.0001)
                        
                        if not polygon.is_valid:
                            print(f"Invalid polygon in {risk_level} risk area")
                            continue
                            
                        # Skip very small polygons
                        if polygon.area < 0.00001:
                            continue
                        
                        # Create GeoJSON feature
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
                        
                        # Validate coordinates before adding
                        if validate_coordinates(feature["geometry"], CHENNAI_BOUNDS):
                            features.append(feature)
                            feature_id += 1
                            print(f"Added {risk_level} risk zone {feature_id}")
                            print(f"First coordinate: {feature['geometry']['coordinates'][0][0]}")
                    except Exception as e:
                        print(f"Error processing shape: {e}")

            if not features:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={"error": "No valid flood zones found"}
                )

            # Create FeatureCollection
            feature_collection = {
                "type": "FeatureCollection",
                "features": features
            }

            # Log sample feature for verification
            if features:
                sample = features[0]
                print("\nSample feature:")
                print(f"Type: {sample['geometry']['type']}")
                print(f"Coordinates sample: {sample['geometry']['coordinates'][0][:2]}")
                print(f"Properties: {sample['properties']}")

            return feature_collection

    except Exception as e:
        print(f"Error processing flood prediction: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )
