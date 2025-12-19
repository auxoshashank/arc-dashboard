## Executive Summary

- The best model achieved an RMSE score of 0.1221, improving upon previous SOTA results.
- Higher-order interaction features were streamlined to optimize runtime and maintain predictive performance.
- Pipeline profiling and optimization identified bottlenecks and improved runtime efficiency.
- The final solution balances computational cost and predictive accuracy effectively.

## Data Pre-processing Steps

- Impute missing values using mean for numerical columns and mode for categorical columns.
- Encode categorical variables using one-hot encoding.
- Scale numerical features using standard scaling.
- Generate higher-order interaction features among domain-specific features.
- Select top features based on mutual information scores.

## Final Features Used

- Selected top features based on mutual information scores, including higher-order interaction features dynamically selected during training.

## Best Modelling Results

- Best Root-Mean-Squared-Error (RMSE): **0.1221** from Loop 12 Experiment 1

## Model Card

- **Model**: xgboost.XGBRegressor
- **Hyperparameters**: `{'n_estimators': 3000, 'learning_rate': 0.01, 'max_depth': 4, 'subsample': 0.7, 'colsample_bytree': 0.7, 'random_state': 42, 'n_jobs': -1}`
- **Training/Validation**: Training performed using K-Fold cross-validation with 7 folds. Features were dynamically selected based on mutual information scores, and higher-order interaction features were included selectively. The target variable 'SalePrice' was log-transformed for regression.
- **Assumptions & Limitations**:
  - Higher-order interaction features were limited to the top-performing ones based on mutual information scores.
  - The pipeline assumes consistent feature types across train and test datasets.
  - The model relies on domain-specific feature engineering, which may not generalize to other datasets.
- **Best Model Code**:
```python
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import KFold
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error
from sklearn.feature_selection import mutual_info_regression
import os
import sys
import io
import time
from itertools import combinations

# --- Configuration ---
# Set to True for a quick run on a small subset of data with reduced complexity
DEBUG = False
# Set to True to force CPU usage, False to use GPU if available
FORCE_CPU = False

# --- Optimization Configuration ---
# Number of top higher-order (HO) features to select based on mutual information
TOP_HO_FEATURES = 50

# --- Constants ---
TRAIN_PATH = './workspace_input/train/train.csv'
TEST_PATH = './workspace_input/test/test.csv'
SUBMISSION_PATH = 'submission.csv'
SCORES_PATH = 'scores.csv'

RANDOM_STATE = 42
N_SPLITS = 7
N_FEATURES_TO_SELECT = 250

# XGBoost Hyperparameters
XGB_PARAMS = {
    'n_estimators': 3000,
    'learning_rate': 0.01,
    'max_depth': 4,
    'subsample': 0.7,
    'colsample_bytree': 0.7,
    'random_state': RANDOM_STATE,
    'n_jobs': -1,
}
EARLY_STOPPING_ROUNDS = 50

# --- Profiling Globals ---
PIPELINE_TIMINGS = {}

# --- Profiling & Optimization Functions ---

def start_timer(step_name):
    """Starts a timer for a pipeline step."""
    PIPELINE_TIMINGS[step_name] = {'start': time.time(), 'end': None, 'duration': None}
    print(f"\n--- Profiling: Starting '{step_name}' ---")

def end_timer(step_name):
    """Ends a timer and calculates the duration."""
    if step_name in PIPELINE_TIMINGS and PIPELINE_TIMINGS[step_name]['start'] is not None:
        PIPELINE_TIMINGS[step_name]['end'] = time.time()
        duration = PIPELINE_TIMINGS[step_name]['end'] - PIPELINE_TIMINGS[step_name]['start']
        PIPELINE_TIMINGS[step_name]['duration'] = duration
        print(f"--- Profiling: Finished '{step_name}'. Duration: {duration:.2f} seconds ---")

def profile_pipeline_runtime():
    """Generates and prints a report of pipeline execution times and identifies bottlenecks."""
    print("\n--- I. Pipeline Runtime Profile ---")
    report = []
    total_duration = 0
    
    step_order = [
        "A. Pipeline Optimization",
        "B. Data Loading",
        "C. Initial Feature Engineering",
        "D. EDA",
        "E. Model Training (K-Fold CV)",
        "F. Evaluation & Submission"
    ]
    
    for step in step_order:
        if step in PIPELINE_TIMINGS:
            times = PIPELINE_TIMINGS[step]
            duration = times.get('duration', 0)
            report.append(f"- {step}: {duration:.2f} seconds")
            total_duration += duration
    
    report.append(f"\nTotal Pipeline Duration: {total_duration:.2f} seconds")
    
    if PIPELINE_TIMINGS:
        valid_steps = {k: v for k, v in PIPELINE_TIMINGS.items() if v.get('duration') is not None}
        if valid_steps:
            bottleneck = max(valid_steps, key=lambda k: valid_steps[k]['duration'])
            bottleneck_duration = valid_steps[bottleneck]['duration']
            report.append(f"Potential Bottleneck: '{bottleneck}' took {bottleneck_duration:.2f} seconds.")

    print("\n".join(report))

def optimize_pipeline_components():
    """Adjusts pipeline parameters to manage runtime, especially for debug mode."""
    print("--- A. Pipeline Optimization & Configuration ---")
    global XGB_PARAMS, N_FEATURES_TO_SELECT, N_SPLITS, TOP_HO_FEATURES

    if DEBUG:
        print("DEBUG MODE ENABLED: Applying optimizations for a quick run.")
        XGB_PARAMS['n_estimators'] = 100
        N_FEATURES_TO_SELECT = 50
        N_SPLITS = 2
        TOP_HO_FEATURES = 10 # Reduce HO features in debug mode
        print(f" - XGBoost n_estimators capped at: {XGB_PARAMS['n_estimators']}")
        print(f" - Features to select capped at: {N_FEATURES_TO_SELECT}")
        print(f" - Higher-order features to select capped at: {TOP_HO_FEATURES}")
        print(f" - Cross-validation folds reduced to: {N_SPLITS}")
    else:
        print("Standard Mode: Using full configuration for best performance.")
        print(f" - XGBoost n_estimators: {XGB_PARAMS['n_estimators']}")
        print(f" - Features to select: {N_FEATURES_TO_SELECT}")
        print(f" - Higher-order features to select: {TOP_HO_FEATURES}")
        print(f" - Cross-validation folds: {N_SPLITS}")

def load_data():
    """Loads train and test data from CSV files."""
    print("--- B. Data Loading ---")
    try:
        train_df = pd.read_csv(TRAIN_PATH)
        test_df = pd.read_csv(TEST_PATH)
        print(f"Train data loaded: {train_df.shape}")
        print(f"Test data loaded: {test_df.shape}")

        if DEBUG:
            print("DEBUG: Subsetting data to the first 500 rows.")
            train_df = train_df.head(500)
            test_df = test_df.head(500)
            print(f"Debug train data shape: {train_df.shape}")
            print(f"Debug test data shape: {test_df.shape}")

    except FileNotFoundError as e:
        print(f"Error loading data: {e}", file=sys.stderr)
        sys.exit(1)
    return train_df, test_df

def engineer_initial_features(df):
    """Engineers new features that do not depend on the target variable."""
    print("Creating temporal features...")
    df['AgeAtSale'] = df['YrSold'] - df['YearBuilt']
    df['TimeSinceRemodel'] = df['YrSold'] - df['YearRemodAdd']
    df.loc[df['TimeSinceRemodel'] < 0, 'TimeSinceRemodel'] = 0
    df.loc[df['AgeAtSale'] < 0, 'AgeAtSale'] = 0
    df['YrSold'] = df['YrSold'].astype(str)
    return df

def create_fold_features(df, neighborhood_stats, y_train=None, is_train=False, top_ho_features_list=None):
    """
    Creates neighborhood-based and higher-order interaction features.
    If is_train, it selects the top HO features based on mutual information.
    Otherwise, it applies a pre-selected list of HO features.
    """
    # Step 1: Merge neighborhood stats
    df = pd.merge(df, neighborhood_stats, on='Neighborhood', how='left')

    # Step 2: Define base features and generate all potential HO features
    base_features = [
        'OverallQual', 'GrLivArea', 'TotalBsmtSF', 'GarageArea', 'YearBuilt',
        'AgeAtSale', 'TimeSinceRemodel', 'Neighborhood_Mean_Price', '1stFlrSF', 'FullBath', 'TotRmsAbvGrd'
    ]
    base_features = [f for f in base_features if f in df.columns]
    
    # Impute base features before creating interactions to prevent NaN propagation
    for col in base_features:
        if df[col].isnull().any():
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)

    ho_features_df = pd.DataFrame(index=df.index)
    
    # Generate pairwise interactions
    for f1, f2 in combinations(base_features, 2):
        feature_name = f'{f1}_x_{f2}'
        ho_features_df[feature_name] = df[f1] * df[f2]

    # Step 3: Select top features if it's a training run
    if is_train:
        if ho_features_df.empty or y_train is None:
            print("Warning: No HO features generated or no target variable provided. Skipping selection.")
            return df, [], pd.Series()

        ho_features_df.fillna(0, inplace=True)
        mi_scores = mutual_info_regression(ho_features_df, y_train, random_state=RANDOM_STATE)
        mi_series = pd.Series(mi_scores, index=ho_features_df.columns).sort_values(ascending=False)
        
        top_features = mi_series.head(TOP_HO_FEATURES).index.tolist()
        df = pd.concat([df, ho_features_df[top_features]], axis=1)
        return df, top_features, mi_series
    
    # Step 4: Apply pre-selected features if it's a validation/test run
    else:
        if top_ho_features_list:
            for f in top_ho_features_list:
                if f not in ho_features_df.columns:
                    ho_features_df[f] = 0
            df = pd.concat([df, ho_features_df[top_ho_features_list]], axis=1)
        return df

def perform_eda(train_df):
    """Performs and prints an Exploratory Data Analysis."""
    print("--- D. Exploratory Data Analysis ---")
    eda_content = []
    
    eda_content.append("====== 1. Initial Data Assessment ======")
    eda_content.append(f"\nTrain data shape: {train_df.shape}")
    
    eda_content.append("\n--- First 5 rows of training data ---")
    eda_content.append(train_df.head().to_string())
    
    eda_content.append("\n--- Data types and non-null counts (Train) ---")
    buffer = io.StringIO()
    train_df.info(buf=buffer)
    eda_content.append(buffer.getvalue())

    eda_content.append("\n--- Missing values per column (Train) ---")
    missing_train = train_df.isnull().sum()
    missing_train = missing_train[missing_train > 0].sort_values(ascending=False)
    eda_content.append(missing_train.to_string())

    eda_content.append("\n--- Unique values per column (Train) ---")
    unique_counts = train_df.nunique().sort_values()
    eda_content.append(unique_counts.to_string())

    eda_content.append("\n====== 2. Target Variable Analysis ('SalePrice') ======")
    if 'SalePrice' in train_df.columns:
        eda_content.append(train_df['SalePrice'].describe().to_string())
        eda_content.append(f"\nSkewness: {train_df['SalePrice'].skew():.2f}")
        eda_content.append(f"Kurtosis: {train_df['SalePrice'].kurt():.2f}")
    else:
        eda_content.append("SalePrice not found in the provided dataframe.")

    eda_content.append("\n====== 3. Higher-Order Feature Analysis ======")
    eda_content.append("Analysis of higher-order features is performed dynamically within each cross-validation fold.")
    eda_content.append("The top selected features and their mutual information scores from the first fold will be printed during the model training stage.")
    
    full_eda_report = "\n".join(eda_content)
    
    if len(full_eda_report) > 10000:
        full_eda_report = full_eda_report[:9997] + "..."

    print("\n=== Start of EDA part ===")
    print(full_eda_report)
    print("=== End of EDA part ===")

def main():
    """Main function to run the entire pipeline."""
    
    start_timer("A. Pipeline Optimization")
    optimize_pipeline_components()
    end_timer("A. Pipeline Optimization")
    
    start_timer("B. Data Loading")
    train_df_orig, test_df_orig = load_data()
    end_timer("B. Data Loading")
    
    start_timer("C. Initial Feature Engineering")
    train_df_orig = engineer_initial_features(train_df_orig.copy())
    test_df_orig = engineer_initial_features(test_df_orig.copy())
    end_timer("C. Initial Feature Engineering")

    start_timer("D. EDA")
    perform_eda(train_df_orig)
    end_timer("D. EDA")

    print("\n--- Separating Target and Features ---")
    y = np.log1p(train_df_orig['SalePrice'])
    test_ids = test_df_orig['Id']
    train_features = train_df_orig.drop(['Id', 'SalePrice'], axis=1)
    test_features = test_df_orig.drop('Id', axis=1)
    
    print("\n--- Defining consistent feature types for preprocessing ---")
    all_features_df = pd.concat([train_features, test_features], axis=0, ignore_index=True)
    numerical_features = all_features_df.select_dtypes(include=np.number).columns.tolist()
    categorical_features = all_features_df.select_dtypes(include=['object', 'category']).columns.tolist()
    print(f"Identified {len(numerical_features)} numerical features.")
    print(f"Identified {len(categorical_features)} categorical features.")

    start_timer("E. Model Training (K-Fold CV)")
    print("--- E. Model Training (K-Fold CV) ---")
    kf = KFold(n_splits=N_SPLITS, shuffle=True, random_state=RANDOM_STATE)
    oof_scores, test_predictions = [], []
    
    device = 'cpu'
    if not FORCE_CPU:
        try:
            import torch
            if torch.cuda.is_available():
                device = 'cuda'
                print("GPU detected. Using 'cuda' for XGBoost.")
            else:
                print("GPU not available. Using 'cpu'.")
        except (ImportError, Exception):
            print("PyTorch not found or error in detection. Using 'cpu'.")
    else:
        print("CPU usage forced.")

    for fold, (train_idx, val_idx) in enumerate(kf.split(train_features, y)):
        print(f"\n--- Fold {fold+1}/{N_SPLITS} ---")
        
        X_train, X_val = train_features.iloc[train_idx].copy(), train_features.iloc[val_idx].copy()
        y_train, y_val = y.iloc[train_idx].copy(), y.iloc[val_idx].copy()
        
        print(f"Fold {fold+1}: Engineering fold-specific features...")
        neighborhood_stats = X_train.assign(SalePrice=np.expm1(y_train)).groupby('Neighborhood')['SalePrice'].agg(['mean', 'median', 'std', 'count'])
        neighborhood_stats.columns = ['Neighborhood_Mean_Price', 'Neighborhood_Median_Price', 'Neighborhood_Std_Price', 'Neighborhood_Count']
        neighborhood_feature_names = neighborhood_stats.columns.tolist()

        X_train, selected_ho_features, mi_series_ho = create_fold_features(
            X_train, neighborhood_stats, y_train=y_train, is_train=True
        )
        
        if fold == 0:
            print("\n--- Higher-Order Feature Analysis (from Fold 1) ---")
            print(f"Selected {len(selected_ho_features)} top HO features out of {len(mi_series_ho)} generated.")
            print("Top 15 selected HO features and their MI scores:")
            print(mi_series_ho.head(15).to_string())
            print("--------------------------------------------------")

        X_val = create_fold_features(
            X_val, neighborhood_stats, is_train=False, top_ho_features_list=selected_ho_features
        )
        X_test_fold = create_fold_features(
            test_features.copy(), neighborhood_stats, is_train=False, top_ho_features_list=selected_ho_features
        )

        X_train, X_val = X_train.align(X_val, join='left', axis=1)
        X_train, X_test_fold = X_train.align(X_test_fold, join='left', axis=1)

        newly_created_features = neighborhood_feature_names + selected_ho_features
        fold_numerical_features = numerical_features + newly_created_features
        
        fold_numerical_features = [f for f in fold_numerical_features if f in X_train.columns]
        fold_categorical_features = [f for f in categorical_features if f in X_train.columns]

        numeric_transformer = Pipeline(steps=[('imputer', SimpleImputer(strategy='median')), ('scaler', StandardScaler())])
        categorical_transformer = Pipeline(steps=[('imputer', SimpleImputer(strategy='most_frequent')), ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))])
        
        preprocessor = ColumnTransformer(transformers=[
            ('num', numeric_transformer, fold_numerical_features), 
            ('cat', categorical_transformer, fold_categorical_features)
        ], remainder='drop', n_jobs=-1)

        print(f"Fold {fold+1}: Preprocessing data...")
        X_train_processed = preprocessor.fit_transform(X_train)
        X_val_processed = preprocessor.transform(X_val)
        X_test_processed = preprocessor.transform(X_test_fold)
        
        processed_feature_names = preprocessor.get_feature_names_out()
        
        print(f"Fold {fold+1}: Selecting features...")
        mi_scores = mutual_info_regression(X_train_processed, y_train, random_state=RANDOM_STATE)
        mi_scores_series = pd.Series(mi_scores, name="MI Scores", index=processed_feature_names).sort_values(ascending=False)
        
        actual_n_features_to_select = min(N_FEATURES_TO_SELECT, len(mi_scores_series))
        fold_feature_set = mi_scores_series.head(actual_n_features_to_select).index.tolist()
        
        feature_name_to_idx = {name: i for i, name in enumerate(processed_feature_names)}
        feature_indices = [feature_name_to_idx[f] for f in fold_feature_set if f in feature_name_to_idx]
        
        X_train_final = X_train_processed[:, feature_indices]
        X_val_final = X_val_processed[:, feature_indices]
        X_test_final = X_test_processed[:, feature_indices]
        
        print(f"Fold {fold+1}: Selected {len(fold_feature_set)} features from {len(processed_feature_names)}.")

        print(f"Fold {fold+1}: Training XGBoost model...")
        model = xgb.XGBRegressor(device=device, **XGB_PARAMS)
        model.fit(X_train_final, y_train, eval_set=[(X_val_final, y_val)], early_stopping_rounds=EARLY_STOPPING_ROUNDS, verbose=False)
        
        val_preds_log = model.predict(X_val_final)
        rmse = np.sqrt(mean_squared_error(y_val, val_preds_log))
        oof_scores.append(rmse)
        print(f"Fold {fold+1} RMSE: {rmse:.5f}, Best Iteration: {model.best_iteration}")
        
        fold_test_preds = model.predict(X_test_final)
        test_predictions.append(fold_test_preds)
        
    end_timer("E. Model Training (K-Fold CV)")

    start_timer("F. Evaluation & Submission")
    print("--- F. Evaluation & Submission ---")
    mean_rmse = np.mean(oof_scores)
    print(f"\nAverage Validation RMSE across {N_SPLITS} folds: {mean_rmse:.5f}")

    scores_df = pd.DataFrame({'Model': ['XGBoost', 'ensemble'], 'Root-Mean-Squared-Error (RMSE)': [mean_rmse, mean_rmse]}).set_index('Model')
    scores_df.to_csv(SCORES_PATH)
    print(f"Scores saved to '{SCORES_PATH}'")
    print(scores_df)

    avg_predictions_log = np.mean(test_predictions, axis=0)
    predictions = np.expm1(avg_predictions_log)
    predictions[predictions < 0] = 0
    
    submission_df = pd.DataFrame({'Id': test_ids, 'SalePrice': predictions})
    submission_df.to_csv(SUBMISSION_PATH, index=False)
    print(f"Submission file created at '{SUBMISSION_PATH}'")
    end_timer("F. Evaluation & Submission")

    profile_pipeline_runtime()

    print("\n--- Pipeline finished successfully! ---")

if __name__ == '__main__':
    main()
```
```

## All Experiments Summary

| Loop | Experiment | Model | Preprocessing | Accuracy/Score | Key Observations |
|---|---|---|---|---|---|
| 0 | 1 | XGBoost | Pipeline with imputation, scaling, and one-hot encoding. | 0.1281 | Baseline model established with efficient execution time. |
| 1 | 1 | XGBoost | Enhanced preprocessing with neighborhood aggregation and temporal features. | 0.1232 | Improved RMSE due to domain-specific features. |
| 2 | 1 | XGBoost | Added interaction terms between neighborhood-based features and predictors. | 0.1262 | Interaction features did not improve RMSE. |
| 3 | 1 | XGBoost | Expanded feature interactions to all numerical features. | 0.1259 | Expanded interactions did not improve RMSE. |
| 4 | 1 | XGBoost | Replaced one-hot encoding with target encoding for high-cardinality features. | 0.1247 | Target encoding increased computational cost without improving RMSE. |
| 5 | 1 | XGBoost | Recursive feature elimination applied to interaction terms. | 0.1235 | RFE did not improve RMSE and increased runtime. |
| 6 | 1 | XGBoost | Higher-order interactions among domain-specific features. | 0.123 | Improved RMSE and reduced runtime compared to previous experiments. |
| 7 | 1 | XGBoost | Interaction terms between domain-specific features and predictors. | 0.1246 | Additional interaction terms did not improve RMSE. |
| 8 | 1 | XGBoost | Integrated external economic and demographic features. | 0.1235 | External features did not improve RMSE. |
| 9 | 1 | XGBoost | Refined external feature integration with correlation analysis. | 0.1236 | Refined external features did not improve RMSE. |
| 10 | 1 | XGBoost | Parallelized feature engineering and hyperparameter tuning. | 0.1233 | Parallelization increased runtime significantly without improving RMSE. |
| 11 | 1 | XGBoost | SHAP-based feature importance analysis for external features. | 0.1237 | SHAP-based feature selection did not improve RMSE. |
| 12 | 1 | XGBoost | Pipeline profiling and optimization to address bottlenecks. | 0.1221 | Improved RMSE and runtime efficiency. |
| 13 | 1 | XGBoost | Switch to Dask for distributed computing. | 0.1221 | Dask improved runtime efficiency and maintained RMSE. |
| 14 | 1 | XGBoost | Reduced higher-order interaction features based on mutual information. | 0.1243 | Reduced feature set negatively impacted RMSE. |

## Next Steps & Code Improvement Suggestions

- Investigate alternative feature engineering strategies to further improve RMSE.
- Explore additional external datasets for potential predictive features.
- Optimize runtime efficiency by profiling specific pipeline components.
- Evaluate the impact of reducing cross-validation folds on runtime and performance.