#!/bin/bash

# Check if the folder is provided as an argument, otherwise use the current directory
DIRECTORY=${1:-$(pwd)}

# Print the header for the table
printf "%-25s %10s\n" "File Name" "Line Count"
printf "%-25s %10s\n" "----------" "----------"

# Loop through each file in the directory
for file in "$DIRECTORY"/*; do
    # Check if the path is a file (not a directory)
    if [[ -f "$file" ]]; then
        # Count the number of lines in the file
        line_count=$(wc -l < "$file")
        # Print the filename and line count in a formatted table
        printf "%-25s %10d lines\n" "$(basename "$file")" "$line_count"
    fi
done
