import json
import requests
import time
import sys

API_URL = "https://xa-ia-worker.microsansfiltre2408.workers.dev/"

def teach_vocabulary(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    total = len(data)
    for i, item in enumerate(data):
        soninke = item['soninke']
        french = item['french']
        payload = {
            "addWord": True,
            "soninkeWord": soninke,
            "frenchMeaning": french
        }
        try:
            response = requests.post(API_URL, json=payload)
            if response.status_code == 200:
                print(f"✅ {i+1}/{total} - {soninke} -> {french}")
            else:
                print(f"❌ {soninke} -> {response.text}")
        except Exception as e:
            print(f"⚠️ Erreur pour {soninke}: {e}")
        time.sleep(0.2)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 teach.py <fichier.json>")
        sys.exit(1)
    teach_vocabulary(sys.argv[1])
