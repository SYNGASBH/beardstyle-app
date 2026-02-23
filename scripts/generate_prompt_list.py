import psycopg2
from psycopg2.extras import RealDictCursor

# Postavke za beard_style_db na portu 5433
DB_CONFIG = {
    "host": "localhost",
    "database": "beard_style_db",
    "user": "bearduser",
    "password": "beardpass123",
    "port": "5433"
}

def generate_prompt_list():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        # Dohvati name i description za svih 16 stilova
        cur.execute("SELECT name, slug, description FROM beard_styles ORDER BY id;")
        styles = cur.fetchall()

        print("\n--- KOPIRAJ OVO U SYSTEM PROMPT U main.py ---\n")
        print("BAZA PODATAKA (Koristi točno ove ID-eve):")

        for style in styles:
            # style[0] je name, style[1] je slug, style[2] je description
            desc = style[2].replace("\n", " ") if style[2] else "Standard style"
            print(f"- '{style[1]}' ({style[0]}): {desc[:80]}...")

        print(f"\nUkupno stilova: {len(styles)}")
        print("\n---------------------------------------------")
        conn.close()

    except Exception as e:
        print(f"Greška: {e}")

if __name__ == "__main__":
    generate_prompt_list()
