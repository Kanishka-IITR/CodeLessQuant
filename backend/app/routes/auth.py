from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from pymongo import MongoClient
from jose import jwt
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

router = APIRouter()

ALGORITHM = "HS256"

# MongoDB setup
# client = MongoClient(os.getenv("MONGO_URL", "mongodb://localhost:27017"))
client = MongoClient(os.getenv("MONGO_URL"), tls=True, tlsCAFile=certifi.where())
db = client["trading_platform"]
users = db["users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models
class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register(user: UserRegister):
    try:
        if users.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="User already exists")
        users.insert_one({
            "email": user.email,
            "password": hash_password(user.password)
        })
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login(user: UserLogin):
    db_user = users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"email": user.email})
    return {"access_token": token, "token_type": "bearer"}

