from flask import Flask, render_template,request
from jsoner import *
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/main')
def main():
    return render_template('main.html')
@app.route('/info')
def info():
    return render_template('info.html')
@app.route('/orders')
def orders():
    return render_template('orders.html')
@app.route('/provider')
def rashodniki():
    return render_template('provider.html')
@app.route('/products')
def izdelia():
    return render_template('products.html')
@app.route('/finance')
def finance():
    return render_template('finance.html')
@app.route('/settings')
def settings():
    return render_template('settings.html')
@app.route('/people')
def people():
    return render_template('people.html')
@app.route('/save/con', methods=['POST'])
def add_consumable():
    try:
        con = request.form.get('name_con')
        id = request.form.get('id')
        units = request.form.get('unit')
        price = request.form.get('price')
        provider = request.form.get('name_prov')
        count = request.form.get('count')
        save_con(con, units,provider,price,count,id)
        return '<script>window.location = "/provider";</script>'
    except Exception as e:
        return '<script>alert("Ошибка при сохранении: ' + str(e) + '"); window.location = "/provider";</script>'
@app.route('/save/product', methods=['POST'])
def add_product():
    try:
        name = request.form.get('name_prd')
        price = request.form.get('price')
        units = request.form.get('content')
        id = request.form.get("id")
        save_product(name, price, units,id)
        return '<script>window.location = "/products";</script>'
    except Exception as e:
        return '<script>alert("Ошибка при сохранении: ' + str(e) + '"); window.location = "/products";</script>'
@app.route('/save/order', methods=['POST'])
def add_order():
    try:
        name = request.form.get('name_ord')
        units = request.form.get('content')
        revenue = request.form.get('price_o')
        id = request.form.get("id")
        save_order(name, units, revenue,id)
        return '<script>window.location = "/orders";</script>'
    except Exception as e:
        return '<script>alert("Ошибка при сохранении: ' + str(e) + '"); window.location = "/orders";</script>'
@app.route('/save/finance', methods=['POST'])
def add_finance():
    try:
        name = request.form.get('type')
        units = request.form.get('price')
        revenue = request.form.get('desc')
        id = request.form.get('id')
        save_finance(name, units, revenue, id)
        return '<script>window.location = "/finance";</script>'
    except Exception as e:
        return '<script>alert("Ошибка при сохранении: ' + str(e) + '"); window.location = "/finance";</script>'
if __name__ == '__main__':
    app.run(debug=True)