
"""
app.py

Flask API that loads fabric_model.keras, predicts the fabric type
of an uploaded image, and retrieves sustainability information
from material_database.csv.
"""

import os
import csv
import io

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import tensorflow as tf


# --------------------------------------------------
# 1. CONFIGURATION
# --------------------------------------------------

APP_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(APP_DIR, "fabric_model.keras")
LABELS_PATH = os.path.join(APP_DIR, "fabric_model_labels.txt")
MATERIAL_DB_PATH = os.path.join(APP_DIR, "material_database.csv")

IMG_SIZE = (224, 224)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# --------------------------------------------------
# 2. LOAD FABRIC CLASSIFICATION MODEL
# --------------------------------------------------

print("Loading fabric detection model...")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.")


# --------------------------------------------------
# 3. LOAD CLASS LABELS
# --------------------------------------------------

if not os.path.exists(LABELS_PATH):
    raise FileNotFoundError(
        f"Labels file not found: {LABELS_PATH}"
    )

with open(LABELS_PATH, "r", encoding="utf-8-sig") as f:
    CLASS_NAMES = [
        line.strip()
        for line in f
        if line.strip()
    ]

if not CLASS_NAMES:
    raise ValueError("No class labels found in labels file.")

print(f"Classes ({len(CLASS_NAMES)}): {CLASS_NAMES}")


# --------------------------------------------------
# 4. LOAD MATERIAL SUSTAINABILITY DATABASE
# --------------------------------------------------

MATERIAL_DB = {}
ALL_MATERIALS = []

if not os.path.exists(MATERIAL_DB_PATH):
    raise FileNotFoundError(
        f"Material database not found: {MATERIAL_DB_PATH}"
    )

with open(
    MATERIAL_DB_PATH,
    "r",
    newline="",
    encoding="utf-8-sig"
) as f:

    reader = csv.DictReader(f)

    if not reader.fieldnames:
        raise ValueError(
            "material_database.csv is empty or has no header row."
        )

    # Normalize headers to handle spaces and capitalization.
    # Example: " Material " becomes "material".
    reader.fieldnames = [
        name.strip().lstrip("\ufeff").lower()
        for name in reader.fieldnames
    ]

    print("CSV columns found:", reader.fieldnames)

    required_columns = [
        "material",
        "fibre type",
        "sustainability category",
        "reason/criteria"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in reader.fieldnames
    ]

    if missing_columns:
        raise ValueError(
            "Incorrect CSV column names.\n"
            f"Missing columns: {missing_columns}\n"
            f"Found columns: {reader.fieldnames}\n"
            "Expected: Material, Fibre Type, "
            "Sustainability Category, Reason/Criteria"
        )

    for row in reader:

        # Skip completely empty rows.
        if not row.get("material") or not row["material"].strip():
            continue

        material_name = row["material"].strip()
        material_key = material_name.lower()

        material_info = {
            "Material": material_name,
            "Fibre Type": (
                row.get("fibre type") or ""
            ).strip(),
            "Sustainability Category": (
                row.get("sustainability category") or ""
            ).strip(),
            "Reason/Criteria": (
                row.get("reason/criteria") or ""
            ).strip()
        }

        MATERIAL_DB[material_key] = material_info

        ALL_MATERIALS.append({
            "material": material_name,
            "fibre_type": material_info["Fibre Type"],
            "sustainability_category":
                material_info["Sustainability Category"],
            "reason": material_info["Reason/Criteria"]
        })

print(
    f"Loaded {len(MATERIAL_DB)} materials "
    "from material_database.csv"
)


# --------------------------------------------------
# 5. IMAGE PREPROCESSING
# --------------------------------------------------

def preprocess_image(file_bytes):
    """
    Convert uploaded image to RGB, resize it to 224x224,
    and prepare it for model prediction.

    Note: This preprocessing assumes the model expects
    pixel values in the 0-255 range. Match this to the
    preprocessing used during model training.
    """

    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)

    arr = np.array(img, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)

    return arr


# --------------------------------------------------
# 6. HOME ROUTE
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok",
        "message": "Fabric AI API is running",
        "endpoints": {
            "health": "/api/health",
            "materials": "/api/materials",
            "predict": "/api/predict"
        }
    })


# --------------------------------------------------
# 7. HEALTH CHECK
# --------------------------------------------------

@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Fabric AI Python Inference Engine",
        "model": "MobileNetV2 Transfer Learning",
        "classes": CLASS_NAMES,
        "database_count": len(MATERIAL_DB)
    })


# --------------------------------------------------
# 8. GET ALL MATERIALS
# --------------------------------------------------

@app.route("/api/materials", methods=["GET"])
def materials():
    return jsonify({
        "status": "ok",
        "count": len(ALL_MATERIALS),
        "materials": ALL_MATERIALS
    })


# --------------------------------------------------
# 9. FABRIC PREDICTION
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
@app.route("/api/predict", methods=["POST"])
def predict():

    # Check whether an image was uploaded.
    if "image" not in request.files:
        return jsonify({
            "error": "No 'image' file in request. "
                     "Upload an image using the 'image' field."
        }), 400

    file = request.files["image"]

    if not file.filename:
        return jsonify({
            "error": "Empty file uploaded."
        }), 400

    # Read and preprocess the image.
    try:
        image_bytes = file.read()

        if not image_bytes:
            return jsonify({
                "error": "The uploaded image is empty."
            }), 400

        arr = preprocess_image(image_bytes)

    except Exception:
        app.logger.exception("Image preprocessing failed.")

        return jsonify({
            "error": "Could not read the uploaded image. "
                     "Please upload a valid image file."
        }), 400

    # Run fabric classification.
    try:
        predictions = model.predict(arr, verbose=0)[0]

        if len(predictions) != len(CLASS_NAMES):
            app.logger.error(
                "Model output count does not match class labels."
            )
            return jsonify({
                "error": "Model output count does not match "
                         "the number of class labels."
            }), 500

        if not np.all(np.isfinite(predictions)):
            return jsonify({
                "error": "The model produced invalid predictions."
            }), 500

        top_idx = int(np.argmax(predictions))
        top_label = CLASS_NAMES[top_idx]
        top_confidence = float(predictions[top_idx])

        display_label = top_label.capitalize()

        # Create a ranked list of all predictions.
        ranked = sorted(
            [
                {
                    "fabric": CLASS_NAMES[i].capitalize(),
                    "confidence": float(predictions[i])
                }
                for i in range(len(CLASS_NAMES))
            ],
            key=lambda item: item["confidence"],
            reverse=True
        )

    except Exception:
        app.logger.exception("Model prediction failed.")

        return jsonify({
            "error": "Fabric prediction failed."
        }), 500

    # --------------------------------------------------
    # 10. SUSTAINABILITY LOOKUP
    # --------------------------------------------------

    material_info = MATERIAL_DB.get(top_label.strip().lower())

    if material_info:

        sustainability = {
            "fibre_type": material_info["Fibre Type"],
            "category": material_info["Sustainability Category"],
            "reason": material_info["Reason/Criteria"]
        }

    else:

        # Fallback if a predicted class is not in the CSV.
        natural_fabrics = [
            "cotton",
            "linen",
            "silk",
            "wool"
        ]

        if top_label.strip().lower() in natural_fabrics:
            fibre_type = "Natural"
            category = "Not classified in database"
        else:
            fibre_type = "Synthetic"
            category = "Not classified in database"

        sustainability = {
            "fibre_type": fibre_type,
            "category": category,
            "reason": (
                f"No sustainability record found for "
                f"{display_label} in material_database.csv."
            )
        }

    # --------------------------------------------------
    # 11. RETURN JSON RESPONSE
    # --------------------------------------------------

    return jsonify({
        "fabric_type": display_label,
        "confidence": top_confidence,
        "ranked_predictions": ranked,
        "sustainability": sustainability
    })


# --------------------------------------------------
# 12. START FLASK SERVER
# --------------------------------------------------

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    print(
        f"Starting Fabric AI Python backend "
        f"on port {port}..."
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )