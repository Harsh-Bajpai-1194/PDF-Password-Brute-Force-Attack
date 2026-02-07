import pikepdf
import sys

def create_protected_pdf(output_path, password):
    # Create a new PDF with one blank page
    pdf = pikepdf.Pdf.new()
    pdf.add_blank_page()
    
    # Apply encryption (user and owner password)
    # Using 128-bit or 256-bit AES as standard
    encryption = pikepdf.Encryption(user=password, owner=password, R=6)
    
    pdf.save(output_path, encryption=encryption)
    print(f"SUCCESS: Created protected PDF at {output_path}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        create_protected_pdf(sys.argv[1], sys.argv[2])
    else:
        # Default for local testing
        create_protected_pdf("test_locked.pdf", "1234")