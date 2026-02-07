import pikepdf

def create_protected_pdf(filename, password):
    # Create a new, blank PDF
    pdf = pikepdf.Pdf.new()
    pdf.add_blank_page()
    
    # Save with encryption (4-digit PIN)
    encryption = pikepdf.Encryption(owner=password, user=password, allow=pikepdf.Permissions(accessibility=True))
    pdf.save(filename, encryption=encryption)
    print(f"File '{filename}' created with password: {password}")

if __name__ == "__main__":
    # Change '1234' to any 4-digit PIN you want to test
    create_protected_pdf("test_protected.pdf", "1234")