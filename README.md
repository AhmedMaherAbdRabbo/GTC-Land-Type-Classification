# GTC-Land-Type-Classification

## Project Description

This project focuses on developing a machine learning system for **Land Type Classification using Sentinel-2 Satellite Images**. The goal is to build an accurate land classification model that can identify different land cover types using satellite imagery, supporting critical applications in agriculture monitoring, urban planning, water resource management, and environmental studies.

## Problem Statement

Accurate land type classification is essential for various applications such as crop monitoring, detecting urban expansion, and managing water and environmental resources. However, satellite imagery is high-dimensional and requires careful preprocessing and organization before being suitable for machine learning models.

## Project Workflow

### 1. Data Preparation (Phase 1)

* Collected the **EuroSAT dataset** (based on Sentinel-2 satellite imagery).
* Verified dataset structure (stored in TensorFlow Datasets format with TFRecords).
* Extracted dataset and organized images into a consistent folder structure.
* Checked dataset integrity, ensuring proper labeling of land cover classes.
* Prepared the dataset for preprocessing and modeling stages.

###  Phase 2: Exploratory Data Analysis (EDA) & Feature Building

## BY:Roaa Ahmed

📊 Exploratory Data Analysis (EDA) & Feature Engineering

🔎 What We Did

 • ✔ Class Distribution
 • Explored dataset balance across the 10 EuroSAT land cover classes.
 
 • ✔ Sample Visualization
 • Displayed random satellite images from each land cover category.
 
 • ✔ Pixel Intensity Analysis
 • Plotted RGB histograms to study pixel value distributions and color patterns.
 
 • ✔ Data Augmentation Check
 • Compared original vs augmented images to verify preprocessing.
 
 • ✔ Dataset Statistics
 • Computed mean & standard deviation per channel for normalization.
 
 • ✔ Class Balance (Pie Chart)
 • Created pie charts for a more intuitive view of dataset balance.
 
 • ✔ Variability Analysis
 • Showed diversity of samples within the same class (e.g., different “River” images).
 
 • ✔ Class Similarity Heatmap
 • Built a heatmap based on mean RGB values to analyze similarities between land cover types.

⸻

🎯 Why This Matters

This structured analysis allows us to:
 • Understand dataset balance and diversity.
 • Identify potential challenges like class overlap or similar visual patterns.
 • Apply feature engineering (augmentation + normalization) to improve model robustness before training.

⸻

📈 Insights & Observations
 • The dataset is balanced, reducing the risk of bias.
 • Some classes (e.g., Forest vs HerbaceousVegetation) share similar color profiles, which may cause misclassification.
 • Data augmentation improves generalization by simulating real-world variations.
 • Normalization with computed channel means/stds ensures stable training.

### 3. Model Training & Validation (Next Phase)

* Develop CNN or transfer learning models (ResNet, EfficientNet, etc.) for image classification.
* Train models on prepared satellite imagery data.
* Evaluate model performance using comprehensive metrics:

  * Accuracy
  * Precision
  * Recall
  * F1-score per land class

### 4. Deployment via Web Interface (Future Phase)

* Create a lightweight frontend application.
* Enable users to upload satellite image tiles.
* Provide real-time land type classification predictions.
* Display results with confidence scores and visualizations.

## Expected Deliverables

1. **Preprocessed Dataset**: Organized, normalized, and augmented EuroSAT dataset ready for training.
2. **Trained Model**: A robust land classification model with comprehensive evaluation metrics.
3. **Technical Report**: Summary document describing model performance, methodology, and challenges encountered.
4. **Web Application**: User-friendly interface for testing land classification on satellite images.
5. **Documentation**: Complete codebase with proper documentation and usage instructions.

## Technology Stack

* **Machine Learning**: Python, TensorFlow/PyTorch, Scikit-learn
* **Image Processing**: OpenCV, PIL, NumPy
* **Data Analysis**: Pandas, Matplotlib, Seaborn
* **Web Development**: Streamlit/Flask for deployment
* **Satellite Data**: Sentinel-2, EuroSAT datasets

## Team Information

This project is being developed as part of the GTC internship program by the ML Team.

### Team Members

* Ahmed Maher
* Roaa Ahmed
* Rowan Mohamed
* Alaa Ramadan
* Hamza Abdelsalam
* Omnia Mohamed

## License

*License information will be added upon project completion.*
