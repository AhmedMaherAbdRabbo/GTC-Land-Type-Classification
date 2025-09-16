
# GTC-Land-Type-Classification

## Project Description

This project focuses on developing a machine learning system for **Land Type Classification using Sentinel-2 Satellite Images**. The goal is to build an accurate land classification model that can identify different land cover types using satellite imagery, supporting critical applications in agriculture monitoring, urban planning, water resource management, and environmental studies.

## Problem Statement

Accurate land type classification is essential for various applications

## Project Workflow

### 1. Data Preparation
- Source publicly available datasets (Sentinel-2, EuroSAT, or similar satellite imagery)
- Preprocess images through resizing, normalizing spectral bands, and consistent land type labeling
- Ensure data quality and consistency across the dataset

### 2. Exploratory Data Analysis (EDA) + Feature Building
- Analyze dataset for land class distribution and image quality
- Implement data augmentation techniques to improve model generalization:
  - Random cropping
  - Rotation
  - Other relevant transformations

### 3. Model Training & Validation
- Develop CNN or transfer learning models (ResNet, EfficientNet, etc.) for image classification
- Train models on prepared satellite imagery data
- Evaluate model performance using comprehensive metrics:
  - Accuracy
  - Precision
  - Recall
  - F1-score per land class

### 4. Deployment via Web Interface
- Create a lightweight frontend application
- Enable users to upload satellite image tiles
- Provide real-time land type classification predictions
- Display results with confidence scores and visualizations

## Expected Deliverables

1. **Trained Model**: A robust land classification model with comprehensive evaluation metrics
2. **Technical Report**: Summary document describing model performance, methodology, and challenges encountered
3. **Web Application**: User-friendly interface for testing land classification on satellite images
4. **Documentation**: Complete codebase with proper documentation and usage instructions

## Technology Stack

- **Machine Learning**: Python, TensorFlow/PyTorch, Scikit-learn
- **Image Processing**: OpenCV, PIL, NumPy
- **Data Analysis**: Pandas, Matplotlib, Seaborn
- **Web Development**: Streamlit/Flask for deployment
- **Satellite Data**: Sentinel-2, EuroSAT datasets

## Team Information

This project is being developed as part of the GTC internship program by the ML Team.
### Team Members
- Ahmed Maher
- Roaa Ahmed
- Rowan Mohamed
- Alaa Ramadan
- Hamza Abdelsalam


## License

*License information will be added upon project completion.*
