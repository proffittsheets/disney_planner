#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

BUCKET=$(terraform output -raw bucket_name 2>/dev/null || true)
DISTRIBUTION=$(terraform output -raw cloudfront_distribution_id 2>/dev/null || true)
if [ -z "$BUCKET" ] || [ -z "$DISTRIBUTION" ]; then
  echo "Error: couldn't read Terraform outputs." >&2
  echo "Initialise Terraform first (the backend flag is required):" >&2
  echo "  terraform init -backend-config=backend.hcl" >&2
  echo "If you haven't provisioned the infrastructure yet, run 'terraform apply' after init." >&2
  exit 1
fi
SITE_ROOT=".."

echo "Syncing to s3://$BUCKET ..."
aws s3 sync "$SITE_ROOT" "s3://$BUCKET" \
  --exclude ".git/*" \
  --exclude "terraform/*" \
  --exclude ".gitignore" \
  --exclude ".DS_Store" \
  --exclude "AGENTS.md" \
  --exclude "README.md" \
  --exclude "LICENSE" \
  --delete

echo "Invalidating CloudFront cache ..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION" \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text

echo "Done — $(terraform output -raw site_url)"
