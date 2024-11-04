from flask import Flask, json, render_template, redirect, request, session
import datetime
import mysql.connector
import os



app = Flask(__name__)

# os.urandom(24).hex()
app.secret_key = "7c999aba887aebbdabee377185ea21cff5eeebec1cc748e9"  # Necesario para usar sesiones

print(app.secret_key)

EXEMPT_ROUTES = [
	'/showSignUp',
	'/showSignIn',
	'/signUp',
	'/signIn',
	'/validateLogin',
	'/static/signup.css',
	'/static/signIn.css',
]

def authenticateSession():
	if 'username' in session:
		user = session["username"]
		return True
	else:
		return redirect('/showSignIn')

@app.before_request
def before_request():
	if request.path not in EXEMPT_ROUTES:
		result = authenticateSession()
		if result is not True:
			return result

@app.route("/logout")
def logout():
	session.clear()
	return redirect("/")

def get_db_connection():
	return mysql.connector.connect(
		host="192.168.30.69",
		user="g6-agustiniv",
		password="GNkYL)T[bL3OwZHK",
		database="g6-agustiniv",
		collation="utf8mb3_general_ci",
	)


@app.route('/showSignUp')
def showSignUp():
	return render_template('signup.html')

@app.route('/signUp', methods=['POST'])
def signUp():
	_name = request.form['inputName']
	_email = request.form['inputEmail']
	_password = request.form['inputPassword']
	
	if _name and _email and _password:
		data = create_user(_name, _password, _email)

		if (data[3] == "Usuario ya existe"):
			return {'error': 'El Usuario ya existe'}
		
		dataValidacion = validate_user_login(_email, _password)
		if dataValidacion[2]:
			session['userId'] = dataValidacion[3]
			session['email'] = _email
			session['username'] = dataValidacion[4]
		else:
			return {'error': 'El Mail o la Contraseña no coinciden'}
		return{'success': 'El Usuario fue creado'}
	else:
		if not _name:
			return {'error': 'Ingrese un Nombre de Usuario'}
		elif not _email:
			return {'error': 'Ingrese un Email valido'}
		elif not _password:
			return {'error': 'Ingrese una contraseña valida'}

@app.route('/showSignIn')
def showSignIn():
	return render_template('signIn.html')

@app.route('/validateLogin', methods=['POST'])
def validateLogin():
	_email = request.form['inputEmail']
	_password = request.form['inputPassword']
	
	data = validate_user_login(_email, _password)
	if data[2]:
		session['userId'] = data[3]
		session['email'] = _email
		session['username'] = data[4]
		return {'success': 'Logueado'}
	else:
		return {'error': 'El Mail o la Contraseña no coinciden'}

def validate_user_login(email, password):
	conn = get_db_connection()
	try:
		with conn.cursor() as cursor:
			data = cursor.callproc('sp_validateLogin', (email, password, 0, 0, 'hola'))
			return data
	except Exception as e:
		conn.rollback()
		print("Error:", e)
		raise e
	finally:
		conn.close()
 
def create_user(name, password, email):
	conn = get_db_connection()
	data = None
	try:
		with conn.cursor() as cursor:
			data = cursor.callproc('sp_createUser', (name, password, email, ''))
			conn.commit()
		return data
	except Exception as e:
		conn.rollback()
		print("Error:", e)
		raise e
	finally:
		conn.close()

@app.route('/getNotas')
def getNotasUsuario():
	userId = session['userId']
	conn = get_db_connection()
	with conn.cursor() as cursor:
		cursor.execute("""
			SELECT id, DATE_FORMAT(fecha_nota, '%m-%d-%Y') as fecha_nota, descripcion, importe, tipo FROM nota
			WHERE user_id = %s
			;
			""", ([userId]))
		return cursor.fetchall()
	conn.close()

@app.route('/createNota', methods=['POST'])
def create_nota():
	data = request.get_json() 
	fecha = data['fecha']
	descripcion = data['descripcion']
	importe = data['importe']
	tipo = data['tipo']
	print(importe)
	
	conn = get_db_connection()
	try:
		with conn.cursor() as cursor:
			cursor.callproc('sp_createNota', (session["userId"], fecha, descripcion, str(importe), tipo))
			conn.commit()
		return 'Nota creada', 200
	except Exception as e:
		conn.rollback()
		print("Error:", e)
		return str(e), 500 
	finally:
		conn.close()

@app.route('/deleteNota', methods=['POST'])
def delete_nota():
	data = request.get_json()
	id = data['id']
	conn = get_db_connection()
	try:
		with conn.cursor() as cursor:
			cursor.callproc('sp_deleteNota', (id, session["userId"]))
			conn.commit()
		return 'Nota eliminada', 200
	except Exception as e:
		conn.rollback()
		print("Error:", e)
		return str(e), 500 
	finally:
		conn.close()

@app.route("/")
def main():
	notas = getNotasUsuario()
	return render_template('calendar.html', notas=notas)

app.run(debug=True)