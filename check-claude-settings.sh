#!/bin/bash

# Check Claude Settings Script
# Detects corruption and auto-restores from backup

SETTINGS_FILE=".claude/settings.local.json"
BACKUP_FILE=".claude/settings.local.json.backup"

echo "Checking $SETTINGS_FILE for corruption..."

# Check for heredoc patterns (sign of corruption)
if grep -q "<<" "$SETTINGS_FILE" 2>/dev/null; then
    echo "⚠️  WARNING: Corruption detected in $SETTINGS_FILE"
    echo "   Found heredoc pattern (<<) in permissions - this shouldn't be there"

    if [ -f "$BACKUP_FILE" ]; then
        echo "   Restoring from backup..."
        cp "$BACKUP_FILE" "$SETTINGS_FILE"
        echo "✅ Restored clean settings from backup"
    else
        echo "❌ No backup found at $BACKUP_FILE"
        echo "   Please manually fix $SETTINGS_FILE"
        exit 1
    fi
else
    echo "✅ Settings file looks clean"
fi

# Check for extremely long permission entries (another sign of corruption)
if [ -f "$SETTINGS_FILE" ]; then
    MAX_LINE_LENGTH=$(wc -L < "$SETTINGS_FILE" 2>/dev/null)
    if [ "$MAX_LINE_LENGTH" -gt 200 ]; then
        echo "⚠️  WARNING: Found suspiciously long lines in $SETTINGS_FILE"
        echo "   Max line length: $MAX_LINE_LENGTH characters"
        echo "   This might indicate corrupted permissions"

        if [ -f "$BACKUP_FILE" ]; then
            echo "   Backup available at $BACKUP_FILE if needed"
        fi
    fi
fi

echo ""
echo "Done checking settings."
