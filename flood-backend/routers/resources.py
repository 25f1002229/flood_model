from fastapi import APIRouter

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.get("/")
def get_resources():
    return {
    "contacts": ["Emergency: 112", "Local helpline: 1800-123-456"]
    }