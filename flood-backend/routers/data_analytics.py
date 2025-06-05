from fastapi import APIRouter

router = APIRouter(prefix="/data", tags=["Data & Analytics"])

@router.get("/history")
def get_historical_data():
    return {
    "years": [2021, 2022, 2023],
    "data": {
    "2023": {"flood_events": 7, "avg_rainfall": "1020mm"},
    "2022": {"flood_events": 4, "avg_rainfall": "890mm"}
}
}