#!/bin/bash

# Backup Claude Settings Script
# Run this before major Claude Code sessions to preserve a clean copy

SETTINGS_FILE=".claude/settings.local.json"
BACKUP_FILE=".claude/settings.local.json.backup"

if [ -f "$SETTINGS_FILE" ]; then
    cp "$SETTINGS_FILE" "$BACKUP_FILE"
    echo "✅ Backed up $SETTINGS_FILE to $BACKUP_FILE"
    echo "   Timestamp: $(date)"
else
    echo "❌ Error: $SETTINGS_FILE not found"
    exit 1
fi
