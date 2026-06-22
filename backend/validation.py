import numpy as np
import json
import os

def run_validation_analysis():
    # 10 Successes, 10 Failures (Mocked for demonstration based on realistic biomechanical expectations)
    # Metrics: [PeakHeightNorm, MaxKneeFlexion, MaxHipFlexion, AirtimeMs]

    successes = [
        [0.65, 35, 40, 1100], [0.62, 38, 42, 1050], [0.68, 30, 35, 1150], [0.60, 40, 45, 1000], [0.70, 25, 30, 1200],
        [0.64, 36, 41, 1080], [0.66, 32, 38, 1120], [0.61, 39, 44, 1020], [0.67, 31, 36, 1140], [0.63, 37, 43, 1060]
    ]

    failures = [
        [0.45, 65, 70, 750], [0.48, 58, 62, 800], [0.42, 75, 80, 700], [0.50, 55, 60, 850], [0.40, 80, 85, 650],
        [0.46, 62, 68, 780], [0.44, 70, 75, 720], [0.49, 57, 63, 820], [0.43, 72, 78, 710], [0.47, 60, 65, 790]
    ]

    data = np.array(successes + failures)
    labels = np.array([1]*10 + [0]*10)

    metrics_names = ["PeakHeightNorm", "MaxKneeFlexion", "MaxHipFlexion", "AirtimeMs"]

    report = {
        "summary": "Validation Analysis: Successful vs. Failed Backflips",
        "distributions": {},
        "correlations": {},
        "strongest_predictors": []
    }

    for i, name in enumerate(metrics_names):
        succ_vals = data[:10, i]
        fail_vals = data[10:, i]

        report["distributions"][name] = {
            "success_mean": round(float(np.mean(succ_vals)), 3),
            "failure_mean": round(float(np.mean(fail_vals)), 3),
            "separation": round(float(abs(np.mean(succ_vals) - np.mean(fail_vals))), 3)
        }

        # Point-biserial correlation approximation
        corr = np.corrcoef(data[:, i], labels)[0, 1]
        report["correlations"][name] = round(float(corr), 3)

    # Rank by absolute correlation
    ranked = sorted(report["correlations"].items(), key=lambda x: abs(x[1]), reverse=True)
    report["strongest_predictors"] = [item[0] for item in ranked]

    return report

if __name__ == "__main__":
    report = run_validation_analysis()
    with open("validation_report.json", "w") as f:
        json.dump(report, f, indent=2)
    print("Validation report generated.")
