# 🚀 SUPER SIMPLE TRAINING

## What you have now:
```
nl2sql/training/
├── RUN_ME.ps1          ← Just run this!
├── train_lora.py       ← The training code
├── dataset.jsonl       ← 120 examples
└── README.md           ← This file
```

## How to use:

### Option 1: Double-click (EASIEST)
1. Find `RUN_ME.ps1` in Windows Explorer
2. Right-click → "Run with PowerShell"
3. Done! ✓

### Option 2: Command line
```powershell
cd C:\Users\ma.bhuiyan\Desktop\DataSense\nl2sql\training
.\RUN_ME.ps1
```

### Option 3: More control
```powershell
# First time only - install packages
pip install transformers peft torch

# Run training
python train_lora.py --steps 1
```

## What happens?
- Downloads tiny model (~50MB)
- Trains for 1 step (~30 seconds)
- Saves adapter to `lora_adapter/`

## Want more training?
```powershell
python train_lora.py --steps 100     # More steps
python train_lora.py --steps 10 --model_name gpt2  # Better model
```

## Need help?
The script is only ~80 lines - check `train_lora.py` to see what it does!
