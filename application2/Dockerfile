# ---------- Stage 1: build the React front end (Vite) ----------
FROM node:20-slim AS web
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json tailwind.config.js postcss.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

# ---------- Stage 2: Node packages needed at run time (Express gateway) ----------
FROM node:20-slim AS deps
WORKDIR /deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- Stage 3: final image = Python (Flask + TensorFlow) + Node (Express) ----------
FROM python:3.11-slim
WORKDIR /app

# Node runtime copied from the official Node image (no extra downloads needed)
COPY --from=node:20-slim /usr/local/bin/node /usr/local/bin/node

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application files: Flask API, trained model, labels, sustainability table
COPY app.py fabric_model.keras fabric_model_labels.txt material_database.csv ./
COPY package.json ./
COPY server ./server
COPY --from=deps /deps/node_modules ./node_modules
COPY --from=web /web/dist ./dist
COPY start.sh .

# The server writes uploaded images to server/temp_uploads
RUN chmod +x start.sh && mkdir -p server/temp_uploads && chmod -R 777 server/temp_uploads

ENV PORT=7860 \
    PYTHON_API_URL=http://127.0.0.1:5000/predict \
    TF_CPP_MIN_LOG_LEVEL=3 \
    HOME=/tmp

EXPOSE 7860
CMD ["./start.sh"]
