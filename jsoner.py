import os
import json
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE_PATH = os.path.join(BASE_DIR, 'static', 'system.json')
def save_finance(name, units,revenue, id):
    os.makedirs('static', exist_ok=True)
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            data = {"finance": {"info": []}}
    else:
        data = {"finance": {"info": []}}
    if "finance" not in data:
        data["finance"] = {"info": []}
    if "info" not in data["finance"]:
        data["finance"]["info"] = []
    new_item = {
        "type": name,
        "id": id,
        "price": units,
        "desc":revenue
    }
    data["finance"]["info"].append(new_item)
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise
def save_con(con,units,provider,price,count,id):
    os.makedirs('static', exist_ok=True)
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Ошибка чтения JSON: {e}")
    new_item = {
        "id":id,
        "name": con,
        "provider": provider,
        "units": units,
        "price": price,
        "count": count
    }
    data["consumables"]["info"].append(new_item)
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Ошибка при записи файла: {e}")
        raise
def save_acc(name,units):
    os.makedirs('static', exist_ok=True)
    if JSON_FILE_PATH:
        try:
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print("Файл system.json успешно загружен")
        except json.JSONDecodeError as e:
            print(f"Ошибка чтения JSON: {e}. Создаем новую структуру.")
            data = {"consumables": {"info": []}}
    else:
        print("Файл system.json не существует. Создаем новую структуру.")
        data = {"consumables": {"info": []}}
    if "consumables" not in data:
        print("Создаем раздел 'consumables'")
        data["consumables"] = {"info": []}
    if "info" not in data["consumables"]:
        print("Создаем список 'info'")
        data["consumables"]["info"] = []
    new_item = {
        "name": name,
        "units": units
    }
    data["consumables"]["info"].append(new_item)
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Данные успешно записаны в файл!")
    except Exception as e:
        print(f"Ошибка при записи файла: {e}")
        raise
def save_product(name, price, units,id):
    os.makedirs('static', exist_ok=True)
    if JSON_FILE_PATH:
        try:
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            data = {"products": {"info": []}}
    else:
        data = {"products": {"info": []}}
    if "products" not in data:
        data["products"] = {"info": []}
    if "info" not in data["products"]:
        data["products"]["info"] = []
    new_item = {
        "id":id,
        "name": name,
        "price": price,
        "content": units,
        "popular":"0"
    }
    data["products"]["info"].append(new_item)
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise
def save_order(name, units,revenue,id):
    os.makedirs('static', exist_ok=True)
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            data = {"orders": {"info": []}}
    else:
        data = {"orders": {"info": []}}
    if "orders" not in data:
        data["orders"] = {"info": []}
    if "info" not in data["orders"]:
        data["orders"]["info"] = []
    new_item = {
        "id":id,
        "name": name,
        "progress":"Активный",
        "content": units,
        "revenue":revenue
    }
    data["orders"]["info"].append(new_item)
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise
def save_finance(name, units,revenue, id):
    os.makedirs('static', exist_ok=True)
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            data = {"finance": {"info": []}}
    else:
        data = {"finance": {"info": []}}
    if "finance" not in data:
        data["finance"] = {"info": []}
    if "info" not in data["finance"]:
        data["finance"]["info"] = []
    new_item = {
        "type": name,
        "id": id,
        "price": units,
        "desc":revenue
    }
    data["finance"]["info"].append(new_item)
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise