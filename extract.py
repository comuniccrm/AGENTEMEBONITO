import sys
try:
    import PyPDF2
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    import PyPDF2

try:
    reader = PyPDF2.PdfReader('public/tarifario.pdf')
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n\n"
    
    if not text.strip():
        print("PDF SECURE OR IMAGE ONLY")
    else:
        print("--- EXTRACTED TEXT ---")
        print(text[:3000])
        print("--- END EXTRACTED TEXT ---")
except Exception as e:
    print("ERROR:", str(e))
