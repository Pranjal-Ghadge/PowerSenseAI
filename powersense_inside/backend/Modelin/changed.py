# =====================================================
# POWERSENSE FINAL ML PROJECT (Enhanced Version)
# Prediction + Residual-Based Anomaly Detection + Insights
# =====================================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# =====================================================
# 1️⃣ LOAD DATA
# =====================================================

data = pd.read_csv("data/data.csv")
data["Datetime"] = pd.to_datetime(data["Datetime"], format="mixed")
data = data.sort_values("Datetime").reset_index(drop=True)

# =====================================================
# 2️⃣ CREATE TOTAL POWER TARGET
# =====================================================

data["TotalPower"] = (
    data["PowerConsumption_Zone1"] +
    data["PowerConsumption_Zone2"] +
    data["PowerConsumption_Zone3"]
)

# =====================================================
# 3️⃣ FEATURE ENGINEERING (TIME & LAGS)
# =====================================================

data["hour"] = data["Datetime"].dt.hour
data["dayofweek"] = data["Datetime"].dt.dayofweek
data["month"] = data["Datetime"].dt.month
data["is_weekend"] = data["dayofweek"].isin([5,6]).astype(int)

# Cyclical time features
data["sin_hour"] = np.sin(2*np.pi*data["hour"]/24)
data["cos_hour"] = np.cos(2*np.pi*data["hour"]/24)
data["sin_week"] = np.sin(2*np.pi*data["dayofweek"]/7)
data["cos_week"] = np.cos(2*np.pi*data["dayofweek"]/7)
data["sin_month"] = np.sin(2*np.pi*data["month"]/12)
data["cos_month"] = np.cos(2*np.pi*data["month"]/12)

# Lag features
data["TotalPower_lag1"] = data["TotalPower"].shift(1)
data["TotalPower_lag24"] = data["TotalPower"].shift(24)

# Rolling features
data["TotalPower_roll24_mean"] = data["TotalPower"].rolling(24).mean()
data["TotalPower_roll24_std"] = data["TotalPower"].rolling(24).std()

# Drop NA rows created by lag/rolling
data = data.dropna().reset_index(drop=True)

# =====================================================
# 4️⃣ SELECT FEATURES
# =====================================================

features = [
    "Temperature",
    "Humidity",
    "WindSpeed",
    "GeneralDiffuseFlows",
    "DiffuseFlows",
    "sin_hour", "cos_hour",
    "sin_week", "cos_week",
    "sin_month", "cos_month",
    "is_weekend",
    "TotalPower_lag1", "TotalPower_lag24",
    "TotalPower_roll24_mean", "TotalPower_roll24_std",
    "TotalPower"
]

dataset = data[features]

# =====================================================
# 5️⃣ NORMALIZATION
# =====================================================

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(dataset)

# =====================================================
# 6️⃣ CREATE TIME WINDOWS
# =====================================================

WINDOW = 24
X, y = [], []

for i in range(WINDOW, len(scaled_data)):
    X.append(scaled_data[i-WINDOW:i])
    y.append(scaled_data[i][-1])

X = np.array(X)
y = np.array(y)

# =====================================================
# 7️⃣ LSTM MODEL
# =====================================================

model = Sequential()
model.add(LSTM(64, input_shape=(X.shape[1], X.shape[2])))
model.add(Dense(32, activation="relu"))
model.add(Dense(1))
model.compile(optimizer="adam", loss="mse")

print("Training Model...")
model.fit(X, y, epochs=10, batch_size=64)

# =====================================================
# 8️⃣ PREDICTIONS
# =====================================================

pred_scaled = model.predict(X)

# Convert scaled predictions back to original scale
temp_pred = np.zeros((len(pred_scaled), len(features)))
temp_pred[:, -1] = pred_scaled[:, 0]
predicted_power = scaler.inverse_transform(temp_pred)[:, -1]

temp_actual = np.zeros((len(y), len(features)))
temp_actual[:, -1] = y
actual_power = scaler.inverse_transform(temp_actual)[:, -1]

# =====================================================
# 9️⃣ FUTURE PREDICTION
# =====================================================

last_window = scaled_data[-WINDOW:].reshape(1, WINDOW, len(features))
future_scaled = model.predict(last_window)

future_temp = np.zeros((1, len(features)))
future_temp[:, -1] = future_scaled[:, 0]
future_power = scaler.inverse_transform(future_temp)[:, -1]

print("\n🔮 NEXT TIME STEP PREDICTION:")
print(f"Predicted Total Power = {future_power[0]:.2f}")

# =====================================================
# 🔟 ACTUAL VS PREDICTED TABLE
# =====================================================

results_df = pd.DataFrame({
    "Actual Power": actual_power[:50],
    "Predicted Power": predicted_power[:50]
})
results_df.to_csv("predicted_results.csv", index=False)

# =====================================================
# 1️⃣1️⃣ ERROR METRICS
# =====================================================

mae = mean_absolute_error(actual_power, predicted_power)
rmse = np.sqrt(mean_squared_error(actual_power, predicted_power))
print(f"MAE: {mae:.2f}, RMSE: {rmse:.2f}")

# =====================================================
# 1️⃣2️⃣ RESIDUAL-BASED ANOMALY DETECTION
# =====================================================

residuals = np.abs(actual_power - predicted_power)
threshold = residuals.mean() + 3 * residuals.std()
anomalies = residuals > threshold
anomaly_indices = np.where(anomalies)[0]
print(f"⚠️ Anomalies Found: {len(anomaly_indices)}")

# =====================================================
# 1️⃣3️⃣ VISUALIZATIONS (Fixed & Robust)
# =====================================================

# Align actual and predicted lengths
aligned_actual = actual_power[: len(predicted_power)]

# Only anomalies within the first 2000 time steps
anomaly_plot_idx = anomaly_indices[anomaly_indices < 2000]

# Main timeline with anomalies
plt.figure(figsize=(12,6))
plt.plot(aligned_actual[:2000], label="Actual Power")
plt.plot(predicted_power[:2000], '--', label="Predicted Power")
plt.scatter(
    anomaly_plot_idx,
    aligned_actual[anomaly_plot_idx],
    color="red",
    marker="*",
    s=120,
    label="Prediction-based Anomaly"
)
plt.title("PowerSense Prediction + Anomaly Detection")
plt.xlabel("Time Step")
plt.ylabel("Total Power")
plt.legend()
plt.show()

# Residual distribution
plt.figure(figsize=(10,5))
plt.hist(residuals, bins=50, color='skyblue', edgecolor='black')
plt.title("Residual Error Distribution")
plt.xlabel("Absolute Error")
plt.ylabel("Frequency")
plt.show()

# Hourly load profile
plt.figure(figsize=(10,5))
data.groupby('hour')['TotalPower'].mean().plot(kind='bar')
plt.title("Average Power by Hour of Day")
plt.xlabel("Hour")
plt.ylabel("Average Power")
plt.show()

# Weekday vs weekend usage
plt.figure(figsize=(8,5))
sns.boxplot(x='is_weekend', y='TotalPower', data=data)
plt.title("Weekday vs Weekend Power Consumption")
plt.xlabel("Weekend (1=Yes)")
plt.ylabel("Total Power")
plt.show()

# Hour vs dayofweek heatmap
plt.figure(figsize=(10,6))
pivot = data.pivot_table(values='TotalPower', index='hour', columns='dayofweek', aggfunc='mean')
sns.heatmap(pivot, annot=True, fmt=".0f", cmap='YlGnBu')
plt.title("Average Power: Hour vs Day of Week")
plt.xlabel("Day of Week")
plt.ylabel("Hour")
plt.show()

# Correlation heatmap
plt.figure(figsize=(12,10))
sns.heatmap(data[features].corr(), annot=True, fmt=".2f", cmap='coolwarm')
plt.title("Feature Correlation Heatmap")
plt.show()

# Power vs Temperature scatter
plt.figure(figsize=(8,5))
sns.scatterplot(x='Temperature', y='TotalPower', data=data)
plt.title("Total Power vs Temperature")
plt.show()

# Rolling mean & std
plt.figure(figsize=(12,6))
plt.plot(data['TotalPower'], alpha=0.5, label='Actual Power')
plt.plot(data['TotalPower'].rolling(24).mean(), label='Rolling Mean 24h', color='orange')
plt.plot(data['TotalPower'].rolling(24).std(), label='Rolling Std 24h', color='green')
plt.title("Total Power with Rolling Mean & Std")
plt.xlabel("Time")
plt.ylabel("Total Power")
plt.legend()
plt.show()
