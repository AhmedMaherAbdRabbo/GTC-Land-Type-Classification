from flask import Flask, request, render_template, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os

app = Flask(__name__)

# Load the trained VGG16 model
MODEL_PATH = 'models/model_vgg16.keras'
model = None

CLASS_NAMES = [
    'Annual Crop', 'Forest', 'Herbaceous Vegetation', 'Highway', 
    'Industrial', 'Pasture', 'Permanent Crop', 'Residential', 
    'River', 'Sea Lake'
]

CLASS_DESCRIPTIONS = {
    'Annual Crop': 'Agricultural land used for crops that are planted and harvested within one year',
    'Forest': 'Dense woodland areas with tree coverage',
    'Herbaceous Vegetation': 'Areas covered with non-woody plants and grasslands',
    'Highway': 'Major roads and transportation infrastructure',
    'Industrial': 'Manufacturing facilities and industrial complexes',
    'Pasture': 'Grasslands used for livestock grazing',
    'Permanent Crop': 'Agricultural land for long-term crops like orchards and vineyards',
    'Residential': 'Housing areas and residential neighborhoods',
    'River': 'Flowing water bodies and river systems',
    'Sea Lake': 'Large water bodies including seas and lakes'
}

def load_model():
    global model
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        return False
    return True

def preprocess_image(image):
    try:
        image = image.resize((224, 224))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        img_array = np.array(image)
        img_array = img_array.astype('float32') / 255.0
        
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if model is None:
            if not load_model():
                return jsonify({'error': 'Model not available'}), 500
        
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        
        if processed_image is None:
            return jsonify({'error': 'Error processing image'}), 400
        
        predictions = model.predict(processed_image)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        class_probabilities = []
        for i, prob in enumerate(predictions[0]):
            class_probabilities.append({
                'class': CLASS_NAMES[i],
                'probability': float(prob),
                'description': CLASS_DESCRIPTIONS[CLASS_NAMES[i]]
            })
        
        class_probabilities.sort(key=lambda x: x['probability'], reverse=True)
        
        img_buffer = io.BytesIO()
        image.save(img_buffer, format='PNG')
        img_str = base64.b64encode(img_buffer.getvalue()).decode()
        
        return jsonify({
            'predicted_class': CLASS_NAMES[predicted_class_idx],
            'confidence': confidence,
            'description': CLASS_DESCRIPTIONS[CLASS_NAMES[predicted_class_idx]],
            'all_predictions': class_probabilities,
            'image': img_str
        })
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    # Load model on startup
    print("Loading model...")
    if load_model():
        print("Starting Flask application...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load model. Please check the model path.")