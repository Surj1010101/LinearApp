# Testing Notes – Omar

## Branch Tested
main
2405244-suraj

## Main Branch
- Base repository structure present
- Only README currently visible in main

## Suraj Frontend Branch
- React + TypeScript frontend implemented
- Pages include Login, Register, Dashboard, CheckIn, Recommendations, History, Insights, Inbox, Tools
- Recommendations page fetches data using recommendationService

## AI-Model
- Implemented using Python and Flask API
- Uses NLP text classification model to analyse user journal entries
- Endpoint /analyse receives journal text and returns burnout sentiment score
- Model files and training scripts present (train_nlp.py, training.py)
- Dataset folder included for model training

## Backend
- Implemented using python
- Uses SQLite db (linear.db)
- API endpoints defined in routes folder
- User auth implemented
- DB models defined for user, checkin recommendation
- Rule based recommendation eng
  
## Observations
- Frontend structure seems well developed
- AI model exists and well develeoped 
- Integration into main is still pending as we await backend

## Next Testing Steps
- Review backend branch
