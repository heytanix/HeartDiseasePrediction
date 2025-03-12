from flask import Flask, render_template, request, jsonify
import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.naive_bayes import GaussianNB
import json

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_data(filepath):
    try:
        # Load and process the data
        data = pd.read_csv(filepath)
        
        # Store original indices
        original_indices = data.index.tolist()
        
        # Preprocessing
        label_encoder = LabelEncoder()
        data['Heart Disease'] = label_encoder.fit_transform(data['Heart Disease'])
        
        # Define features X and target y
        X = data.drop('Heart Disease', axis=1)
        y = data['Heart Disease']
        
        # Standardize the features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train the model on all data
        naive_bayes = GaussianNB()
        naive_bayes.fit(X_scaled, y)
        
        # Get predictions and probabilities
        y_pred = naive_bayes.predict(X_scaled)
        y_pred_proba = naive_bayes.predict_proba(X_scaled)
        
        # Calculate accuracy
        accuracy = (y_pred == y).mean() * 100
        
        # Get indices of positive and negative predictions
        positive_indices = [original_indices[i] for i in range(len(y_pred)) if y_pred[i] == 1]
        negative_indices = [original_indices[i] for i in range(len(y_pred)) if y_pred[i] == 0]
        
        # Calculate correlation matrix
        correlation_matrix = pd.DataFrame(X_scaled, columns=X.columns).corr().values.tolist()
        
        # Create results dictionary
        results = {
            'predictions': y_pred.tolist(),
            'probabilities': y_pred_proba.tolist(),
            'feature_names': X.columns.tolist(),
            'positive_indices': positive_indices,
            'negative_indices': negative_indices,
            'accuracy': round(accuracy, 2),  # Round to 2 decimal places
            'correlation_matrix': correlation_matrix,  # Add correlation matrix
            'success': True
        }
        
        return results
        
    except Exception as e:
        return {'success': False, 'error': str(e)}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Save the file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        # Process the file
        results = process_data(filepath)
        
        # Clean up - remove the uploaded file
        os.remove(filepath)
        
        if results['success']:
            return jsonify(results)
        else:
            return jsonify({'error': results['error']}), 400
    
    return jsonify({'error': 'File type not allowed'}), 400

# For Vercel deployment
app.debug = False

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))