"""
LSTM-style consumption forecast output for PowerSense ML Analytics Dashboard.
Outputs JSON: labels, actual, predicted, upperBound, lowerBound.
Run: python new.py  (or python3 new.py)
"""
import json
import math
from datetime import datetime, timedelta

def main():
    n = 30  # number of days
    base = 35.0
    # Generate date labels (e.g. "Feb 8", "Mar 9")
    start = datetime.now()
    labels = []
    for i in range(n):
        d = start + timedelta(days=i)
        labels.append(d.strftime("%b ") + str(d.day))
    # Simulate actual consumption (sine + weekend effect + small noise)
    actual = []
    for i in range(n):
        day_of_week = (i % 7)
        trend = base + 10 * math.sin(i * 0.2)
        weekend = -5 if day_of_week >= 5 else 0
        noise = (hash(str(i)) % 100) / 25.0 - 2.0  # deterministic "noise"
        val = max(20.0, trend + weekend + noise)
        actual.append(round(val, 2))

    # LSTM-style predicted values (slight lag/smoothing of actual)
    predicted = []
    for i in range(n):
        prev = actual[i - 1] if i > 0 else actual[0]
        pred = 0.7 * actual[i] + 0.3 * prev + ((hash(str(i + 100)) % 100) / 50.0 - 1.0)
        predicted.append(round(max(10.0, pred), 2))

    # Confidence bounds around prediction
    upper_bound = [round(p + 12 + (hash(str(i + 200)) % 50) / 10.0, 2) for i, p in enumerate(predicted)]
    lower_bound = [round(max(10.0, p - 12 - (hash(str(i + 300)) % 50) / 10.0), 2) for i, p in enumerate(predicted)]

    out = {
        "labels": labels,
        "actual": actual,
        "predicted": predicted,
        "upperBound": upper_bound,
        "lowerBound": lower_bound,
    }
    print(json.dumps(out))

if __name__ == "__main__":
    main()
