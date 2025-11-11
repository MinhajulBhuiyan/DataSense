# Simple One-Click Training Runner
# Just run this file: Right-click -> Run with PowerShell

param(
    [int]$steps = 1,
    [string]$model = "sshleifer/tiny-gpt2"
)

Write-Host "Starting training setup..." -ForegroundColor Cyan

# Go to script directory
cd $PSScriptRoot

# Install packages if needed
Write-Host "Installing packages..." -ForegroundColor Yellow
pip install -q transformers peft torch datasets 2>&1 | Out-Null

# Run training
Write-Host "Running training ($steps steps)..." -ForegroundColor Green
python train_lora.py --steps $steps --model_name $model

Write-Host "`nDone! Check 'lora_adapter' folder for results." -ForegroundColor Green
