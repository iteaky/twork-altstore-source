#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

: "${ICON_URL:=https://iteaky.github.io/twork-altstore-source/icon.png}"
: "${REPO_URL:=https://github.com/iteaky/twork-altstore-source}"
: "${DOWNLOAD_URL:=https://github.com/iteaky/twork-altstore-source/releases/download/v1.0.0-beta.1/Twork.ipa}"
: "${IPA_SIZE_BYTES:=5737465}"
: "${BUNDLE_IDENTIFIER:=com.trainercrm.app}"

cat > "${ROOT_DIR}/source.json" <<EOF
{
  "name": "Twork Beta",
  "identifier": "com.iteaky.twork.source",
  "subtitle": "Private beta builds for testers",
  "description": "Beta versions of Twork for testing via AltStore Classic.",
  "iconURL": "${ICON_URL}",
  "website": "${REPO_URL}",
  "apps": [
    {
      "name": "Twork",
      "bundleIdentifier": "${BUNDLE_IDENTIFIER}",
      "developerName": "Konstantin E",
      "subtitle": "CRM app for fitness trainers",
      "localizedDescription": "Twork helps manage clients, trainings, subscriptions and balances.",
      "iconURL": "${ICON_URL}",
      "screenshotURLs": [],
      "versions": [
        {
          "version": "1.0.0-beta.1",
          "date": "2026-05-17",
          "localizedDescription": "Initial beta build for testers.",
          "downloadURL": "${DOWNLOAD_URL}",
          "size": ${IPA_SIZE_BYTES},
          "minOSVersion": "16.0"
        }
      ]
    }
  ],
  "news": []
}
EOF
