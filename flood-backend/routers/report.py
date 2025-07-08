from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/report", tags=["Report"])

class FloodReport(BaseModel):
    name: str
    location: str
    description: str
    timestamp: datetime

reports = []

@router.post("/")
def submit_report(report: FloodReport):
    reports.append(report)
    return {"status": "received", "total_reports": len(reports)}

@router.get("/")
def get_reports():
    return reports