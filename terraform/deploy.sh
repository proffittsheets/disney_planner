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

COMMON_EXCLUDES=(
  --exclude ".git/*"
  --exclude ".claude/*"
  --exclude "terraform/*"
  --exclude ".gitignore"
  --exclude ".DS_Store"
  --exclude "AGENTS.md"
  --exclude "README.md"
  --exclude "LICENSE"
)

# Images and other assets: cache for a year (rarely change)
echo "Syncing assets to s3://$BUCKET (long cache) ..."
aws s3 sync "$SITE_ROOT" "s3://$BUCKET" \
  "${COMMON_EXCLUDES[@]}" \
  --exclude "*.html" --exclude "*.js" --exclude "*.jsx" --exclude "*.css" \
  --cache-control "public, max-age=31536000" \
  --delete

# Code: always re-upload with no-cache so browsers revalidate every load
echo "Uploading code to s3://$BUCKET (no-cache) ..."
aws s3 cp "$SITE_ROOT" "s3://$BUCKET" --recursive \
  "${COMMON_EXCLUDES[@]}" \
  --exclude "*" --include "*.html" --include "*.js" --include "*.jsx" --include "*.css" \
  --cache-control "no-cache"

# Remove files deployed before they were excluded (idempotent)
aws s3 rm "s3://$BUCKET/.claude" --recursive --quiet 2>/dev/null || true

echo "Invalidating CloudFront cache ..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION" \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text

echo "Done — $(terraform output -raw site_url)"
