#!/bin/bash
# meeting-prep.sh — Fetches today's calendar and creates meeting prep notes
# Runs via system cron hourly on weekdays

set -euo pipefail

PROJECT_DIR="/Users/michaelchapman/Documents/Secondbrain2"
CLAUDE="/Users/michaelchapman/.local/bin/claude"
LOG_FILE="$PROJECT_DIR/scripts/meeting-prep.log"
PROMPT_FILE="$PROJECT_DIR/scripts/meeting-prep-prompt.txt"

echo "$(date '+%Y-%m-%d %H:%M:%S') — Starting meeting prep" >> "$LOG_FILE"

cd "$PROJECT_DIR"

"$CLAUDE" -p \
  --allowedTools "mcp__apple-calendar__get_events,Read,Write,Glob,Grep" \
  < "$PROMPT_FILE" >> "$LOG_FILE" 2>&1

echo "$(date '+%Y-%m-%d %H:%M:%S') — Meeting prep complete" >> "$LOG_FILE"
