from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import home, live_map, forecast, report, resources, data_analytics, about

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Add all required methods
    allow_headers=["*"],
)

app.include_router(home.router)
app.include_router(live_map.router)
app.include_router(forecast.router)
app.include_router(report.router)
app.include_router(resources.router)
app.include_router(data_analytics.router)
app.include_router(about.router)

@app.get("/")
def read_root():
    return {"message": "Flood Management API"}
