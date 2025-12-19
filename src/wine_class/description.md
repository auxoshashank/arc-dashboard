# Project Name: Wine Quality Prediction

## Overview

### Problem Description
Wine quality assessment is a critical task in the wine industry, as it directly impacts consumer satisfaction, pricing, and marketability. Traditionally, wine quality is evaluated by human experts, which can be subjective, time-consuming, and inconsistent. By leveraging machine learning, we aim to automate this process and provide a consistent, data-driven approach to predicting wine quality based on its physicochemical properties.

The dataset contains physicochemical measurements of wines, such as acidity, residual sugar, chlorides, sulfur dioxide, density, pH, sulphates, and alcohol content, along with a quality score ranging from 1 to 10. Understanding how these chemical properties influence wine quality can also provide valuable insights for winemakers to optimize their production processes.

### Objective
**Your Goal** is to develop a multi-class classification model that predicts the wine quality score (1–10) based on its physicochemical properties.

---
## Data Description

The dataset contains 1143 rows and 13 columns. Each row represents a unique wine sample, and the columns include both input features and the target variable. Below is a summary of the dataset structure:

### Key Files
- **wine_data.csv**: The primary dataset containing physicochemical properties and quality scores for wine samples.

### Columns
1. **fixed_acidity**: Concentration of fixed acids in the wine.
2. **volatile_acidity**: Concentration of volatile acids, which can affect the wine's aroma.
3. **citric_acid**: Citric acid content, contributing to the wine's freshness.
4. **residual_sugar**: Amount of sugar remaining after fermentation.
5. **chlorides**: Salt content in the wine.
6. **free_sulfur_dioxide**: Free form of sulfur dioxide, which acts as an antioxidant.
7. **total_sulfur_dioxide**: Total sulfur dioxide content, including bound and free forms.
8. **density**: Density of the wine, which can indicate sugar and alcohol content.
9. **pH**: Acidity level of the wine.
10. **sulphates**: Sulfate content, contributing to wine preservation.
11. **alcohol**: Alcohol content of the wine.
12. **quality**: Target variable, representing the wine quality score (1–10).
13. **id**: Unique identifier for each wine sample.

### Dataset Summary
- **Rows**: 1143 (wine samples)
- **Columns**: 13 (12 features + 1 target variable)

---
## Modeling

This is a multi-class classification task where the goal is to predict the wine quality score (1–10) based on its physicochemical properties.

* **Input**: A vector of 11 numerical features representing the physicochemical properties of the wine:
  `[fixed_acidity, volatile_acidity, citric_acid, residual_sugar, chlorides, free_sulfur_dioxide, total_sulfur_dioxide, density, pH, sulphates, alcohol]`
* **Output**: A single categorical prediction representing the wine quality score (1–10).
* **Recommended Loss Function**: Categorical Cross-Entropy Loss.
* **Evaluation Metric**: Macro F1-Score.

---
## Evaluation

### Macro F1-Score
The Macro F1-Score is a harmonic mean of precision and recall, calculated independently for each class and then averaged. It is particularly suitable for this problem as it ensures that all quality scores (1–10) are treated equally, regardless of class imbalance. This metric provides a balanced evaluation of the model's performance across all wine quality categories.

---
## Submission Format

For each unique identifier in the test dataset, you must predict the wine quality score. The submission file must be a CSV where the first column is the unique identifier (`id`), followed by the predicted quality score.

**Example CSV Format:**
```csv
id,quality
1,7
2,5
3,8
...
```

Each row corresponds to a wine sample, and the `quality` column contains the predicted quality score (an integer between 1 and 10).