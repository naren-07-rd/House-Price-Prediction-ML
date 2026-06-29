from fastapi import FastAPI
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from schema import HouseData
import joblib

BASE_DIR = Path(__file__).resolve().parent
model = joblib.load(BASE_DIR / "model" / "house_price_model.pkl")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API is working"}
    

@app.post("/predict")
def predict(data: HouseData):

    features = [[
        data.longitude,
        data.latitude,
        data.housing_median_age,
        data.total_rooms,
        data.total_bedrooms,
        data.population,
        data.households,
        data.median_income,
        
    ]]

    prediction = model.predict(features)

    return {
        "predicted_house_value": float(prediction[0])
    }