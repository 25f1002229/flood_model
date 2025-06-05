from fastapi import APIRouter

router = APIRouter(prefix="/forecast", tags=["Forecast"])

@router.get("/short-term")
def short_term_forecast():
    return {"rainfall": "heavy", "prediction": "60mm in 6 hours"}

@router.get("/long-term")
def long_term_forecast():
    return {"risk": "moderate", "trend": "increasing flood risk over 3 days"}