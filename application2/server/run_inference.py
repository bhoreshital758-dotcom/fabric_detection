"""
run_inference.py
Standalone CLI runner to perform inference using fabric_model.keras and output JSON.
Usage: python run_inference.py <image_path>
"""
import sys
import os
import json
import csv
import io
import numpy as np
from PIL import Image

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    image_path = sys.argv[1]
    app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(app_dir, "fabric_model.keras")
    labels_path = os.path.join(app_dir, "fabric_model_labels.txt")
    material_db_path = os.path.join(app_dir, "material_database.csv")

    try:
        model = tf.keras.models.load_model(model_path)
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {e}"}))
        sys.exit(1)

    with open(labels_path) as f:
        class_names = [line.strip() for line in f if line.strip()]

    material_db = {}
    with open(material_db_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            material_db[row["Material"].strip().lower()] = row

    try:
        img = Image.open(image_path).convert("RGB")
        img = img.resize((224, 224))
        arr = np.array(img, dtype=np.float32)
        arr = np.expand_dims(arr, axis=0)
    except Exception as e:
        print(json.dumps({"error": f"Failed to process image: {e}"}))
        sys.exit(1)

    predictions = model.predict(arr, verbose=0)[0]
    top_idx = int(np.argmax(predictions))
    top_label = class_names[top_idx]
    top_confidence = float(predictions[top_idx])

    ranked = sorted(
        [
            {
                "fabric": class_names[i].capitalize(),
                "confidence": float(predictions[i])
            }
            for i in range(len(class_names))
        ],
        key=lambda x: x["confidence"],
        reverse=True,
    )

    material_info = material_db.get(top_label.lower())
    if material_info:
        sustainability = {
            "fibre_type": material_info["Fibre Type"],
            "category": material_info["Sustainability Category"],
            "reason": material_info["Reason/Criteria"],
        }
    else:
        sustainability = {
            "fibre_type": "Natural" if top_label.lower() in ["cotton", "linen", "silk", "wool"] else "Synthetic",
            "category": "Eco-Friendly" if top_label.lower() in ["cotton", "linen", "silk", "wool"] else "Non-Eco-Friendly",
            "reason": f"Standard profile for {top_label.capitalize()}.",
        }

    result = {
        "fabric_type": top_label.capitalize(),
        "confidence": top_confidence,
        "ranked_predictions": ranked,
        "sustainability": sustainability,
    }
    print(json.dumps(result))

if __name__ == "__main__":
    main()
