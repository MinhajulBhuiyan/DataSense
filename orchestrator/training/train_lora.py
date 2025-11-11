"""
Simple LoRA Training Script
Usage: python train_lora.py --steps 1
"""
import argparse
import json
import os
import torch
from torch.utils.data import DataLoader, Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import LoraConfig, get_peft_model


class SimpleDataset(Dataset):
    def __init__(self, file_path, tokenizer):
        self.examples = []
        self.tokenizer = tokenizer
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    obj = json.loads(line)
                    text = obj['prompt'] + "\nSQL: " + obj['completion']
                    self.examples.append(text)
    
    def __len__(self):
        return len(self.examples)
    
    def __getitem__(self, idx):
        enc = self.tokenizer(self.examples[idx], truncation=True, max_length=256, return_tensors='pt')
        return {
            'input_ids': enc['input_ids'].squeeze(0),
            'attention_mask': enc['attention_mask'].squeeze(0),
            'labels': enc['input_ids'].squeeze(0)
        }


def collate_fn(batch):
    input_ids = [b['input_ids'] for b in batch]
    attention_mask = [b['attention_mask'] for b in batch]
    labels = [b['labels'] for b in batch]
    
    input_ids = torch.nn.utils.rnn.pad_sequence(input_ids, batch_first=True, padding_value=0)
    attention_mask = torch.nn.utils.rnn.pad_sequence(attention_mask, batch_first=True, padding_value=0)
    labels = torch.nn.utils.rnn.pad_sequence(labels, batch_first=True, padding_value=-100)
    
    return {'input_ids': input_ids, 'attention_mask': attention_mask, 'labels': labels}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', type=str, default='dataset.jsonl')
    parser.add_argument('--model_name', type=str, default='sshleifer/tiny-gpt2')
    parser.add_argument('--output_dir', type=str, default='lora_adapter')
    parser.add_argument('--steps', type=int, default=1)
    args = parser.parse_args()
    
    print(f"Loading model: {args.model_name}")
    tokenizer = AutoTokenizer.from_pretrained(args.model_name)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    model = AutoModelForCausalLM.from_pretrained(args.model_name)
    
    # Simple LoRA config
    lora_config = LoraConfig(r=8, lora_alpha=32, lora_dropout=0.05, bias='none', task_type='CAUSAL_LM')
    model = get_peft_model(model, lora_config)
    
    print(f"Loading dataset: {args.dataset}")
    dataset = SimpleDataset(args.dataset, tokenizer)
    dataloader = DataLoader(dataset, batch_size=2, collate_fn=collate_fn)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
    
    print(f"Training for {args.steps} steps...")
    model.train()
    step = 0
    for batch in dataloader:
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        step += 1
        print(f"Step {step}/{args.steps} - Loss: {loss.item():.4f}")
        if step >= args.steps:
            break
    
    os.makedirs(args.output_dir, exist_ok=True)
    model.save_pretrained(args.output_dir)
    print(f"\n✓ Saved adapter to: {args.output_dir}")


if __name__ == '__main__':
    main()
