# 🍳 RecipeCraft AI — Smart Recipe Extractor & Meal Planner

**RecipeCraft AI** is a full-stack AI-powered application that extracts structured recipe data from blog URLs using web scraping and Large Language Models (LLMs).

Instead of reading long recipe articles, users can input a URL and instantly get a clean, structured recipe with ingredients, instructions, nutrition insights, substitutions, and more.

---

## 🎯 Project Overview

This system automates the entire pipeline:

> **URL → Scraping → LLM Processing → Structured JSON → Database → UI Rendering**

It combines traditional scraping with LLM-based extraction to produce accurate, structured, and user-friendly recipe data.

---

## ✨ Features

* 🧠 **AI-Powered Extraction**

  * Uses Google Gemini to convert raw HTML into structured recipe data

* 📦 **Structured Output**

  * Title, cuisine, timings, servings
  * Ingredients (quantity, unit, item separated)
  * Step-by-step instructions
  * Nutrition estimates
  * Substitutions and related recipes

* 🛒 **Shopping List Generator**

  * Groups ingredients into categories (dairy, produce, pantry)

* 🧾 **Recipe History**

  * Stores all processed recipes in PostgreSQL

* 🥗 **Meal Planner**

  * Combine multiple recipes into a unified shopping list

* ⚠️ **Error Handling**

  * Handles invalid URLs, non-recipe pages, and LLM failures

---

## 🏗️ System Architecture

1. User inputs a recipe URL in frontend
2. Request is sent to FastAPI backend
3. Backend scrapes HTML using BeautifulSoup
4. Cleaned content is sent to Gemini LLM
5. LLM returns structured JSON
6. Backend validates and stores data in PostgreSQL
7. API response is sent to frontend
8. Frontend renders structured recipe

---

## 🛠️ Tech Stack

### Backend

* FastAPI (Python)
* SQLAlchemy ORM
* PostgreSQL
* Pydantic

### Frontend

* React (Vite)
* Tailwind CSS
* React Query

### AI / LLM

* Google Gemini API
* Prompt engineering with structured JSON output

### Scraping

* BeautifulSoup4
* HTTPX

---

## 📁 Project Structure

```text
backend/
frontend/
prompts/
sample_data/
screenshots/
README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Python 3.12+
* Node.js 18+
* PostgreSQL running
* Gemini API Key

---

### 🔧 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/recipe_db
GEMINI_API_KEY=your_api_key
```

Run server:

```bash
uvicorn main:app --reload
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

| Variable       | Description                  |
| -------------- | ---------------------------- |
| DATABASE_URL   | PostgreSQL connection string |
| GEMINI_API_KEY | Gemini API key               |

---

## 📡 API Endpoints

### POST `/api/extract`

```json
{
  "url": "https://www.allrecipes.com/recipe/23891/grilled-cheese-sandwich/"
}
```

### GET `/api/recipes`

Returns all saved recipes

### GET `/api/recipes/{id}`

Returns recipe details

### POST `/api/meal-plan`

Generates combined shopping list

---

## 🧠 Prompt Engineering

To ensure high-quality outputs, prompts are designed with:

* Strict JSON-only responses
* No hallucination (only use scraped data)
* Null values for missing fields
* Structured ingredient parsing

Prompt templates are available in the `/prompts` folder.

---

## ⚠️ Error Handling

The system handles:

* Invalid URLs → 400 response
* Non-recipe pages → validation error
* LLM failures → retry or graceful fallback
* Scraping failures → fallback mechanism

---

## 📸 Screenshots

### Extract Recipe Page

![Extract Page](./screenshots/extract.jpeg)

### History View

![History Page](./screenshots/history.jpeg)

### Recipe Details Modal

![Modal View](./screenshots/modal.png)

### Meal Planner

![Meal Planner](./screenshots/meal_planner.png)

---

## 🧪 Sample Data

The `sample_data/` folder contains:

* Example recipe URLs tested
* Corresponding API responses (JSON)

---

## 🚀 Deployment

* Frontend: Vercel
* Backend: Render

---

## 🔮 Future Improvements

* Improve parsing accuracy
* Add caching for repeated URLs
* Authentication system
* Rate limiting

---

## 👨‍💻 Author

**Yashwanth Gowda**
