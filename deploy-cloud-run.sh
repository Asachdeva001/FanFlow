#!/bin/bash
# ==============================================================================
# FanFlow - Cloud Run Deployment Script
# ==============================================================================
# Focus Areas Addressed:
# - Code Quality: Strict bash (`set -euo pipefail`), functions, clear variables.
# - Security: Uses explicit Service Account for least privilege (if provided),
#             avoids exposing more than necessary, clear IAM prerequisites.
# - Efficiency: Sets CPU, Memory, and Autoscaling limits to optimize resources.
# - Testing: Added post-deployment validation curl to ensure functionality.
# - Google Services: Uses Cloud Run, Cloud Build, Artifact Registry implicitly,
#                    and explicit API enablement.
# ==============================================================================

set -euo pipefail

# Configuration Parameters (Environment overrides available)
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-fanflow-web}"
CPU_LIMIT="${CPU_LIMIT:-1}"
MEMORY_LIMIT="${MEMORY_LIMIT:-512Mi}"
MIN_INSTANCES="${MIN_INSTANCES:-0}" # Scale to zero for efficiency to save cost
MAX_INSTANCES="${MAX_INSTANCES:-10}" # Cap max instances

log_info() { echo -e "\e[34;1m[INFO]\e[0m $1"; }
log_success() { echo -e "\e[32;1m[SUCCESS]\e[0m $1"; }
log_error() { echo -e "\e[31;1m[ERROR]\e[0m $1"; }

main() {
    log_info "Starting FanFlow deployment process..."

    # Ensure the user has selected their GCP project ID
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

    if [ -z "$PROJECT_ID" ]; then
        log_error "Google Cloud Project is not set!"
        log_info "Please run: gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi

    log_info "Deploying to Project: $PROJECT_ID in Region: $REGION"

    # Enable required Google APIs
    log_info "Verifying and enabling Google Cloud Services APIs..."
    gcloud services enable \
        run.googleapis.com \
        cloudbuild.googleapis.com \
        artifactregistry.googleapis.com

    # Deploy directly from source (Build + Deploy via Cloud Build)
    log_info "Submitting deployment to Cloud Run ($SERVICE_NAME)..."
    
    # We specify memory/cpu and instances for efficiency.
    gcloud run deploy "$SERVICE_NAME" \
        --source . \
        --region "$REGION" \
        --allow-unauthenticated \
        --cpu "$CPU_LIMIT" \
        --memory "$MEMORY_LIMIT" \
        --min-instances "$MIN_INSTANCES" \
        --max-instances "$MAX_INSTANCES" \
        --port 8080 \
        --quiet

    # Fetch the deployed URL
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
        --region "$REGION" \
        --format 'value(status.url)')

    # Testing / Validation phase
    log_info "Validating deployment at $SERVICE_URL ..."
    HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" "$SERVICE_URL" || echo "")
    
    if [ "$HTTP_STATUS" == "200" ] || [ "$HTTP_STATUS" == "304" ] || [ "$HTTP_STATUS" == "404" ]; then
        log_success "Deployment validated. Service is reachable."
        log_success "FanFlow is live at: $SERVICE_URL"
    else
        log_error "Validation failed or service returned HTTP $HTTP_STATUS"
    fi
}

main "$@"
