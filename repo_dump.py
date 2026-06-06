import os

# Configuration: Add or remove directories and extensions you want to ignore
IGNORE_DIRS = {'.git', 'node_modules', '.next', 'out', 'dist', 'build', '__pycache__'}
IGNORE_EXTS = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.log', '.env', '.env.local', '.lock'}
OUTPUT_FILE = 'repo_dump.txt'

def generate_dump(root_dir):
    dump_count = 0
    print(f"Scanning directory: {root_dir}...")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Modify dirnames in-place to skip ignored directories entirely
            dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]

            for filename in filenames:
                # Skip ignored extensions, the dump file itself, and this script
                ext = os.path.splitext(filename)[1].lower()
                if ext in IGNORE_EXTS or filename == OUTPUT_FILE or filename == os.path.basename(__file__):
                    continue

                filepath = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(filepath, root_dir)

                try:
                    with open(filepath, 'r', encoding='utf-8') as infile:
                        content = infile.read()
                    
                    outfile.write(f"// {rel_path}\n")
                    outfile.write("```" + (ext[1:] if ext else "text") + "\n")
                    outfile.write(content)
                    if not content.endswith('\n'):
                        outfile.write('\n')
                    outfile.write("```\n\n")
                    dump_count += 1
                except Exception as e:
                    print(f"Skipping {rel_path} due to read error: {e}")

    print(f"Successfully dumped {dump_count} files into {os.path.abspath(OUTPUT_FILE)}")

if __name__ == "__main__":
    # Automatically uses the directory where the script is located
    project_root = os.path.dirname(os.path.abspath(__file__))
    generate_dump(project_root)