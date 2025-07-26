#!/bin/bash
cd /home/kavia/workspace/code-generation/surf-session-tracker-131704-131713/surf_sync_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

