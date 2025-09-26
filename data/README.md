# EuroSAT Dataset

## Table of Contents

* [Overview](#overview)
* [Dataset Details](#dataset-details)
* [Data Organization](#data-organization)
* [License](#license)

---

## Overview

The **EuroSAT** dataset is a public remote sensing dataset based on Sentinel-2 satellite images. It contains multi-spectral images covering 13 spectral bands. The images consist of 10 classes of land use / land cover, each covering diverse geographical areas in Europe. The dataset is well-suited for tasks such as classification, segmentation, and change detection.

🔗 **Dataset Link:** [EuroSAT on Kaggle](https://www.kaggle.com/datasets/ryanholbrook/eurosat/data)

---

## Dataset Details

| Attribute             | Description                         |
| --------------------- | ----------------------------------- |
| **Number of classes** | 10 land cover / land use categories |
| **Number of images**  | Approximately 27,000 images         |
| **Image size**        | 64 × 64 pixels                      |
| **Spectral bands**    | 13 (Sentinel-2 multispectral)       |
| **Resolution**        | 10–60 m per pixel depending on band |

## 🏞️ Classes include:

| Class | Description | Use Cases |
|-------|-------------|-----------|
| **Annual Crop** | Seasonal agricultural areas | Crop monitoring, yield prediction |
| **Forest** | Dense woodland areas | Deforestation tracking, carbon monitoring |
| **Herbaceous Vegetation** | Grasslands and meadows | Pasture management, biodiversity studies |
| **Highway** | Major transportation routes | Infrastructure planning, traffic analysis |
| **Industrial** | Manufacturing and industrial zones | Urban development, pollution monitoring |
| **Pasture** | Livestock grazing areas | Agricultural planning, land use optimization |
| **Permanent Crop** | Orchards and vineyards | Specialized agriculture monitoring |
| **Residential** | Urban housing areas | Urban growth analysis, population studies |
| **River** | Freshwater bodies | Water resource management, flood monitoring |
| **Sea Lake** | Large water bodies | Coastal monitoring, water level tracking |

---

## Data Organization

The data directory has the following structure:

```
eurosat/
│
├── data/                      # Main image data directory
│   ├── AnnualCrop/
│   ├── Forest/
│   ├── HerbaceousVegetation/
│   ├── Highway/
│   ├── Industrial/
│   ├── Pasture/
│   ├── PermanentCrop/
│   ├── Residential/
│   ├── River/
│   └── SeaLake/
│
└── metadata/                  # Metadata, if available
    ├── class_names.txt        # List of class labels
    └── samples_per_class.csv  # Number of samples per class
```

*Note: Adjust file names and paths depending on your actual folder structure.*

---

## License

This dataset is licensed under the terms provided on the **EuroSAT Kaggle page**. Please ensure you comply with the dataset's license for any usage (academic, commercial, etc.).

---
