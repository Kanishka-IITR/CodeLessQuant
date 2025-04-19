# CodeLessQuant
![Screenshot 2025-04-20 013410](https://github.com/user-attachments/assets/d41a1b12-2d9c-44a9-bd9e-091d3d080ecb)

![Screenshot 2025-04-20 011439](https://github.com/user-attachments/assets/79b01b30-17a7-465a-91bd-e278afccc5ef)
![Screenshot 2025-04-20 011448](https://github.com/user-attachments/assets/599aea4a-85ae-4d7e-b81f-24e772594dca)

**CodeLessQuant** is a low-code, modular platform that empowers users to visually **create**, **backtest**, and **analyze** algorithmic trading strategies — no coding required.
It features a **drag-and-drop Blockly editor**, a **FastAPI backend**, and intuitive **performance visualization tools**. Built for retail traders with minimal coding experience.

---

##  Features

-  Drag-and-drop strategy builder using custom indicator/action blocks
-  JSON generation for backend strategy processing
-  Powerful backtesting engine with:
  - Sharpe Ratio
  - Win Rate
  - Equity Curve
-  Live stock price preview
-  JWT-based user authentication (Register/Login)
-  Clean, modular codebase (React + FastAPI)

---

##  Project Structure

```
CodeLessQuant/
├── frontend/      # React + Blockly
└── backend/       # FastAPI app
```

---

##  Frontend (React + Blockly)

### Key Components

| File | Description |
|------|-------------|
| `BlocklyEditor.js` | Visual editor with custom blocks (RSI, SMA, EMA, MACD, BUY, SELL) |
| `customBlocks.js` | Defines custom Blockly trading blocks |
| `jsonGenerator.js` | Converts blocks into structured strategy JSON |
| `MetricsTable.js` | Displays performance metrics |
| `EquityChart.js` | Shows profit/loss equity curve |
| `LoginPage.js` & `RegisterPage.js` | Handles user authentication |
| `LivePriceViewer.jsx` | Real-time stock price display |

---

##  Backend (FastAPI)

### Main Files

| File | Description |
|------|-------------|
| `main.py` | Entry point for FastAPI |
| `routes/backtest.py` | Handles `/backtest` and `/live-price` APIs |
| `routes/auth.py` | Handles `/register` and `/login` APIs |
| `services/backtester.py` | Runs strategy backtest |
| `services/data_fetcher.py` | Fetches historical stock data (Yahoo Finance) |
| `services/auth_service.py` | Handles user registration & JWT login |
| `models/strategy_model.py` | Strategy JSON Pydantic schema |
| `models/user_model.py` | User schema for auth |
| `utils/indicators.py` | Technical indicator functions |

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/backtest` | Submit strategy JSON for backtesting |
| `GET` | `/live-price/{ticker}` | Get real-time price of a stock |
| `POST` | `/register` | Create a new user |
| `POST` | `/login` | Authenticate and receive JWT token |

---

##  Supported Technical Indicators

- RSI (Relative Strength Index)
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- ATR (Average True Range)

---

##  Setup Instructions

###  Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

####  Environment Variables (via `.env`)

```
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

###  Frontend

```bash
cd frontend
npm install
npm start
```

---

##  Team – Random Forest Rangers

- **Lavisha Kapoor** (22112061)  
- **Kanishka Soni** (22112050)  
- **Soumya Kumari** (22322027)  

---
