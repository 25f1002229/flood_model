from fastapi import APIRouter

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/")
def get_home_data():
    return {"latest_alerts": ["Water level rising in Zone A", "Sensor outage in Sector 9"]}