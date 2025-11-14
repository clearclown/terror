#!/usr/bin/env python3
"""
Remove duplicate organizations from organizations.json
Keeps the first occurrence of each organization ID
"""

import json
from pathlib import Path

def remove_duplicates():
    # Load organizations data
    json_path = Path(__file__).parent.parent / 'web' / 'src' / 'data' / 'organizations.json'

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    organizations = data['organizations']

    # Track seen IDs and keep only first occurrence
    seen_ids = set()
    unique_orgs = []
    duplicates = []

    for org in organizations:
        org_id = org['id']
        if org_id not in seen_ids:
            seen_ids.add(org_id)
            unique_orgs.append(org)
        else:
            duplicates.append(org_id)

    print(f"Original count: {len(organizations)}")
    print(f"Unique count: {len(unique_orgs)}")
    print(f"Duplicates removed: {len(duplicates)}")
    print(f"Duplicate IDs: {', '.join(sorted(set(duplicates)))}")

    # Update data with unique organizations
    data['organizations'] = unique_orgs

    # Write back to file
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully updated {json_path}")

if __name__ == '__main__':
    remove_duplicates()
