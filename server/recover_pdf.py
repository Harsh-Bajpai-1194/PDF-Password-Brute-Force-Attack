import pikepdf
import sys

def attack(path):
    for i in range(10000):
        pin = f"{i:04d}" # Formats as 0000-9999
        try:
            with pikepdf.open(path, password=pin) as pdf:
                print(f"SUCCESS:{pin}")
                return
        except: continue
    print("FAILURE")

if __name__ == "__main__":
    attack(sys.argv[1])