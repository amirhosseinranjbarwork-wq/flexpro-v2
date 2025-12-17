import os

# فرمت‌هایی که اسکن می‌کنیم
EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx', '.css', '.json'}
# پوشه‌هایی که نادیده می‌گیریم
IGNORE_DIRS = {'node_modules', '.git', 'dist', 'build', '.vscode', 'coverage'}

def scan_code():
    output_filename = 'full_project_scan.txt'
    with open(output_filename, 'w', encoding='utf-8') as outfile:
        outfile.write("--- PROJECT SCAN REPORT ---\n")
        
        # 1. ثبت ساختار درختی فایل‌ها
        outfile.write("\n--- FILE STRUCTURE ---\n")
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            level = root.replace(os.getcwd(), '').count(os.sep)
            indent = ' ' * 4 * level
            outfile.write(f"{indent}{os.path.basename(root)}/\n")
            subindent = ' ' * 4 * (level + 1)
            for f in files:
                 if f.endswith(tuple(EXTENSIONS)):
                    outfile.write(f"{subindent}{f}\n")
        
        outfile.write("\n\n--- FILE CONTENTS ---\n")

        # 2. خواندن محتوای فایل‌ها
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for file in files:
                if file.endswith(tuple(EXTENSIONS)) and file != 'scan_project.py':
                    path = os.path.join(root, file)
                    try:
                        with open(path, 'r', encoding='utf-8') as infile:
                            outfile.write(f"\n{'='*50}\nFILE: {path}\n{'='*50}\n")
                            outfile.write(infile.read() + "\n")
                    except Exception as e:
                        outfile.write(f"\nError reading {path}: {e}\n")

    print(f"✅ فایل '{output_filename}' ساخته شد. لطفا آن را آپلود کنید.")

if __name__ == "__main__":
    scan_code()