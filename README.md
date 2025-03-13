# Heart Disease Prediction Web Application

A Flask-based web application that uses machine learning to predict the likelihood of heart disease from patient data. The application allows users to upload CSV files containing patient information, processes the data using a Gaussian Naive Bayes model, and provides detailed analysis results including prediction probabilities, accuracy metrics, and feature correlations.

## Contributors
- [Contributor 1](https://github.com/heytanix)
- [Contributor 2](https://github.com/Sundareshwar-S)
- [Contributor 3](https://github.com/Likhith257)
- [Contributor 4](https://github.com/Saumitra-171)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Data Format](#data-format)
- [How It Works](#how-it-works)
- [Machine Learning Model](#machine-learning-model)
- [Frontend Components](#frontend-components)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [License](#license)

## Overview

This application helps healthcare professionals analyze patient data to predict the likelihood of heart disease. By uploading a CSV file with patient metrics, users receive immediate analysis results including predictions, accuracy metrics, and a visual representation of the data through charts and heatmaps.

## Features

- **File Upload**: Drag-and-drop interface for CSV file uploads.
- **Data Processing**: Automatic preprocessing of patient data.
- **Machine Learning Analysis**: Heart disease prediction using Gaussian Naive Bayes algorithm.
- **Visual Results**:
  - Prediction distribution pie chart.
  - Feature correlation heatmap.
  - Detailed accuracy metrics.
  - Patient categorization: Lists of patients predicted with and without heart disease.
- **Responsive Design**: Works on desktop and mobile devices.

## Technical Stack

- **Backend**:
  - Python 3.6+: Core programming language.
  - Flask: Web framework for handling HTTP requests and responses.
  - Pandas: Data manipulation and analysis.
  - NumPy: Numerical operations and array handling.
  - scikit-learn: Machine learning algorithms and preprocessing tools.
  - Gaussian Naive Bayes model.
  - StandardScaler for feature normalization.
  - LabelEncoder for categorical data encoding.
- **Frontend**:
  - HTML5: Structure of the web application.
  - CSS3: Styling and responsive design.
  - JavaScript: Client-side interactivity.
  - Chart.js: Creating interactive pie charts for prediction distribution.
  - Plotly.js: Generating correlation heatmaps.

## Project Structure

- `main.py`: Main Flask application.
- `templates/`: HTML templates.
  - `index.html`: Main application interface.
- `static/`: Static assets.
  - `styles.css`: CSS styling.
  - `script.js`: Frontend JavaScript.
- `uploads/`: Temporary directory for file uploads.
- `requirements.txt`: Python dependencies.
- `README.md`: Project documentation.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/HeartDiseasePrediction.git
   cd HeartDiseasePrediction
   ```

2. Create a virtual environment (optional):
   ```bash
   python -m venv venv
   ```

   Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python main.py
   ```

5. Open your web browser and navigate to: [http://localhost:8080](http://localhost:8080)

## Usage

After uploading a CSV file, the application will display the analysis results, which include prediction probabilities, accuracy metrics, and feature correlations. The results are displayed in a responsive design, making it accessible on desktop and mobile devices.

## Data Format

The application expects a CSV file with the following structure:

- The CSV must have a column named "Heart Disease" containing the target variable (Yes/No or 1/0).
- Other columns should contain numerical or categorical features related to heart disease prediction.

Example features might include:
- Age
- Sex
- Chest Pain Type
- Resting Blood Pressure
- Cholesterol
- Fasting Blood Sugar
- Resting ECG Results
- Maximum Heart Rate
- Exercise Induced Angina
- ST Depression
- Slope of Peak Exercise ST Segment
- Number of Major Vessels
- Thalassemia

Example CSV format:
```csv
Age,Sex,Chest Pain Type,Resting BP,Cholesterol,Heart Disease
63,1,3,145,233,Yes
37,1,2,130,250,No
41,0,1,130,204,No
...
```

## How It Works

### File Upload Process

- The user uploads a CSV file through the web interface.
- The file is temporarily saved to the server's upload directory.
- After processing, the file is automatically deleted to save space.

### Data Preprocessing

- The CSV file is loaded into a pandas DataFrame.
- Categorical variables are encoded using `LabelEncoder`.
- Features are standardized using `StandardScaler`.
- The data is split into features (X) and target (y).

### Model Training and Prediction

- A Gaussian Naive Bayes model is trained on the preprocessed data.
- The model makes predictions on the same data.
- Prediction probabilities are calculated.
- Accuracy is computed by comparing predictions to actual values.

### Results Generation

- Predictions and probabilities are converted to lists.
- Patient indices are categorized based on predictions.
- A correlation matrix is calculated for all features.
- Results are packaged as JSON and sent back to the frontend.

### Visualization

- The frontend receives the JSON results.
- Chart.js creates a pie chart showing prediction distribution.
- Plotly.js generates a heatmap visualizing feature correlations.
- Patient IDs are displayed in separate lists based on predictions.

## Machine Learning Model

The application uses a Gaussian Naive Bayes classifier for heart disease prediction.

### Why Naive Bayes?

- Effective for medical diagnosis problems.
- Works well with small to medium-sized datasets.
- Fast training and prediction times.
- Handles both binary and multi-class classification.
- Performs well even with limited training data.

### Model Details

- Assumes features follow a Gaussian (normal) distribution.
- Features are assumed to be conditionally independent.
- Uses Bayes' theorem to calculate posterior probabilities.
- Makes predictions based on the highest probability class.

### Performance Metrics

- Accuracy: Percentage of correct predictions. Displayed in the results summary.

## Frontend Components

- **File Upload Area**:
  - Drag-and-drop functionality.
  - File type validation (CSV only).
  - File information display (name and size).
- **Analysis Results**:
  - Summary statistics section.
  - Prediction distribution pie chart.
  - Patient ID lists for positive and negative predictions.
  - Accuracy report with percentage.
- **Detailed Analysis**:
  - Collapsible section for advanced visualizations.
  - Correlation heatmap showing relationships between features.
  - Interactive tooltips showing exact correlation values.

## API Endpoints

- **GET /**:
  - Description: Serves the main application page.
  - Response: HTML page with the application interface.

- **POST /upload**:
  - Description: Handles file upload and data processing.
  - Request:
    - Content-Type: multipart/form-data
    - Body: CSV file in the 'file' field
  - Response: JSON object containing:
    - `predictions`: List of binary predictions (0 or 1).
    - `probabilities`: List of prediction probabilities.
    - `feature_names`: List of column names from the dataset.
    - `positive_indices`: List of patient IDs predicted with heart disease.
    - `negative_indices`: List of patient IDs predicted without heart disease.
    - `accuracy`: Model accuracy percentage.
    - `correlation_matrix`: 2D array of feature correlations.
    - `success`: Boolean indicating successful processing.

## Future Improvements

- **Model Selection**: Allow users to choose from multiple machine learning algorithms.
- **Cross-Validation**: Implement k-fold cross-validation for more robust accuracy metrics.
- **Feature Importance**: Add visualization of feature importance for better interpretability.
- **Data Preprocessing Options**: Provide options for handling missing values and outliers.
- **Export Results**: Allow users to download analysis results in various formats.
- **Batch Processing**: Support for processing multiple files in batch mode.
- **User Authentication**: Add user accounts to save and compare previous analyses.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
