# 🏠 California House Price Prediction

A Machine Learning web application that predicts the median house value in California based on housing-related features. The project includes a trained Machine Learning model, a FastAPI backend, and a responsive HTML/CSS/JavaScript frontend.

---

## 📌 Project Overview

This project predicts the **Median House Value** using housing features from the California Housing dataset. Users can enter housing information through a web interface, and the application returns the predicted house price using a trained Machine Learning model.

---

## 🚀 Features

* Predict California house prices using Machine Learning
* Responsive and modern web interface
* FastAPI REST API backend
* Real-time predictions
* Clean and user-friendly UI
* Model saved using Joblib
* Frontend connected to backend using Fetch API

---

## 🧠 Machine Learning Workflow

* Data Collection
* Exploratory Data Analysis (EDA)
* Data Cleaning
* Feature Engineering
* Model Training
* Model Evaluation
* Model Serialization using Joblib
* FastAPI Integration
* Frontend Development
* End-to-End Deployment Ready

---

## 📊 Input Features

The model predicts the median house value using the following features:

| Feature            | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| Longitude          | Longitude of the house location                                      |
| Latitude           | Latitude of the house location                                       |
| Housing Median Age | Median age of houses                                                 |
| Total Rooms        | Total number of rooms                                                |
| Total Bedrooms     | Total number of bedrooms                                             |
| Population         | Population of the area                                               |
| Households         | Number of households                                                 |
| Median Income      | Median income of residents                                           |
| Ocean Proximity    | Distance category from the ocean (if included in your trained model) |

---

## 🎯 Target Variable

* **Median House Value**

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

---

## 📁 Project Structure

```text
House_Price/
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── model/
│   └── house_price_model.pkl
│
├── data/
│
├── notebook/
│   └── model.ipynb
│
├── main.py
├── schema.py
├── pyproject.toml
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/House_Price_Prediction.git
```

```bash
cd House_Price_Prediction
```

---

### 2. Install Dependencies

Using uv:

```bash
uv sync
```

or using pip:

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Project

### Start the FastAPI Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Start the Frontend

Open another terminal:

```bash
cd Frontend
py -m http.server 8080
```

Frontend URL:

```text
http://127.0.0.1:8080/index.html
```

---

## 🔄 Application Workflow

```text
User
   │
   ▼
Frontend (HTML/CSS/JavaScript)
   │
   ▼
Fetch API
   │
   ▼
FastAPI Backend
   │
   ▼
Machine Learning Model
   │
   ▼
Predicted House Price
   │
   ▼
Displayed on the Website
```

---

## 📸 Screenshots

Add screenshots here after running the application.

Example:

* Home Page
* Prediction Form
* Prediction Result

---

## 📈 Future Improvements

* User authentication
* Interactive charts and analytics
* Input validation improvements
* Cloud deployment
* Docker support
* Database integration
* Model versioning
* Dark mode
* Prediction history

---

## 🎓 Learning Outcomes

This project helped me learn:

* Machine Learning model development
* Data preprocessing and feature engineering
* FastAPI backend development
* REST API creation
* Frontend development using HTML, CSS, and JavaScript
* Connecting frontend and backend
* API testing with Swagger UI
* Model serialization with Joblib
* End-to-end Machine Learning application development

---

## 👨‍💻 Author

**Narenthiranath AS**

Computer Science Engineering Student

Interested in:

* Machine Learning
* Artificial Intelligence
* Data Science
* Full Stack Development

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

## 📄 License

This project is developed for educational and portfolio purposes.
