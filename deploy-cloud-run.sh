#!/bin/bash

# Configuration
REGION="us-central1"
SERVICE_NAME="fanflow-web"
# Ensure the user has selected their GCP project ID
PROJECT_ID=$(gcloud config get-value project)

if [ -z "$PROJECT_ID" ]; then
    echo "NO PROJECT SET!"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "Deploying to Project: $PROJECT_ID in Region: $REGION"

# Enable required APIs
echo "Enabling Cloud Run and Cloud Build APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Deploy directly from source (this uses Cloud Build behind the scenes)
echo "Submitting deployment to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

echo "Deployment complete! You can find the URL in the output above."
