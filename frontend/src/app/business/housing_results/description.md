# Project Name: Ames Housing Price Prediction

## Overview

### Problem Description
The Ames Housing dataset provides detailed information about residential properties in Ames, Iowa. The goal is to predict the final sales price of homes based on a variety of features such as lot size, neighborhood, building type, overall quality, and more. This problem is a classic supervised regression task and serves as a benchmark for evaluating machine learning models in real estate price prediction.

Accurate predictions of house prices are crucial for various stakeholders, including buyers, sellers, real estate agents, and financial institutions. By leveraging machine learning, we aim to provide a robust model that can estimate property values effectively, accounting for diverse factors that influence housing prices.

### Objective
**Your Goal** is to develop a supervised regression model that predicts the final sales price (`SalePrice`) of residential properties in Ames, Iowa.

---
## Data Description

The dataset consists of tabular data with 1460 rows and 81 columns, representing various attributes of residential properties. Below is a summary of key features:

### Key Files
- **`train.csv`**: Contains the training data with 1460 rows and 81 columns, including the target variable `SalePrice`.
- **`test.csv`**: Contains the test data with the same structure as the training data, except for the absence of the target variable `SalePrice`.

### Key Columns
- **`Id`**: Unique identifier for each property.
- **`SalePrice`**: Target variable representing the final sales price of the property in USD (continuous).
- **Property Features**:
  - **`MSSubClass`**: Type of dwelling (e.g., 1-story, 2-story, duplex).
  - **`Neighborhood`**: Physical location within Ames city limits.
  - **`OverallQual`**: Overall material and finish quality (rated 1–10).
  - **`OverallCond`**: Overall condition of the house (rated 1–10).
  - **`YearBuilt`**: Year the house was originally constructed.
  - **`GrLivArea`**: Above-ground living area in square feet.
  - **`GarageCars`**: Size of garage in car capacity.
  - **`LotArea`**: Lot size in square feet.
  - **`TotalBsmtSF`**: Total basement area in square feet.
  - **`KitchenQual`**: Kitchen quality (e.g., Excellent, Good, Typical).
  - **`BsmtQual`**: Basement height quality (e.g., Excellent, Good, Typical).
  - **`ExterQual`**: Exterior material quality (e.g., Excellent, Good, Typical).

For a full list of features and their descriptions, refer to the provided dataset schema.

---
## Modeling

This is a supervised regression task where the goal is to predict a continuous target variable (`SalePrice`).

* **Input**: The model will take as input a set of features describing the property, such as `GrLivArea`, `OverallQual`, `Neighborhood`, and other relevant attributes.
* **Output**: The model will output a single continuous value representing the predicted sales price of the property in USD.
* **Recommended Loss Function**: Mean Squared Error (MSE) or Mean Absolute Error (MAE) can be used during training. However, the evaluation metric requires transforming predictions and ground truth to their logarithmic scale.
* **Evaluation Metric**: Root-Mean-Squared-Error (RMSE) on the logarithm of predicted and actual sales prices.

---
## Evaluation

### Root-Mean-Squared-Error (RMSE) on Logarithmic Scale
The evaluation metric is RMSE computed on the logarithmic scale of the predicted and actual sales prices. This transformation ensures that errors on expensive and inexpensive homes are weighted equally. The formula is:

\[
\text{RMSE}_\log = \sqrt{\frac{1}{N} \sum_{i=1}^{N} \left( \log(\hat{y}_i) - \log(y_i) \right)^2 }
\]

Where:
- \(y_i\): True sales price for record \(i\).
- \(\hat{y}_i\): Predicted sales price for record \(i\).
- \(N\): Total number of records.

Lower RMSE values indicate better model performance.

---
## Submission Format

For each unique `Id` in the test dataset, you must predict the `SalePrice` in USD. The submission file must be a CSV with exactly two columns: `Id` and `SalePrice`.

**Example CSV Format:**
```csv
Id,SalePrice
1461,169000.1
1462,187724.1233
1463,175221
...
```

Ensure that the `Id` values in the submission file match those in the test dataset, and the `SalePrice` values are continuous predictions in USD.