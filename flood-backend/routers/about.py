from fastapi import APIRouter

router = APIRouter(prefix="/about", tags=["About"])

@router.get("/")
def about():
    return {
    "system": "Chennai Flood Monitoring Dashboard",
    "partners": ["Disaster Management Dept", "City Municipality"],
    "contact": "support@chennaifloodwatch.org"
}