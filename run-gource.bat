@echo off
gource -1920x1080 -f --title "REDSTAR DEVELOPMENT" --seconds-per-day 30 --auto-skip-seconds 2 --highlight-all-users --multi-sampling --bloom-multiplier 1 --file-filter "(client_packages|packages|dotnet|test|.*node_modules.*|src/cef/assets-for-s3)" --bloom-intensity 0.5 --key .git/
pause