import json, glob, os

nbs = glob.glob('c:/Users/lenovo/Desktop/new project/**/*.ipynb', recursive=True)
fixed = 0
for nb in nbs:
    try:
        with open(nb, 'r', encoding='utf-8') as f:
            data = json.load(f)
        modified = False
        if 'cells' in data:
            for cell in data['cells']:
                if 'source' in cell:
                    new_source = [s.replace('\\n', '\n') for s in cell['source']]
                    if new_source != cell['source']:
                        cell['source'] = new_source
                        modified = True
        if modified:
            with open(nb, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            fixed += 1
            print(f'Fixed {nb}')
    except Exception as e:
        print(f'Error reading {nb}: {e}')

print(f'Done. Fixed {fixed} notebooks.')
