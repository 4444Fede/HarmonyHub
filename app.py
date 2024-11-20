from flask import Flask, render_template, jsonify, redirect, request, session, url_for
import mysql.connector
import os

app = Flask(__name__)
app.secret_key = os.urandom(24).hex()

def get_db_connection():
    return mysql.connector.connect(
        host="192.168.30.69",
        user="g8-elsublime",
        password="10chegadorcA",
        database="g8-elsublime",
        collation="utf8mb3_general_ci",
    )

@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route('/signUp', methods=['POST'])
def signUp():
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    correo = request.form['correo']
    contrasenia = request.form['contrasenia']

    if nombre and apellido and correo and contrasenia:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO usuario (Nombre, Apellido, Correo, Contrasenia) VALUES (%s, %s, %s, %s)",
                           (nombre, apellido, correo, contrasenia))
            connection.commit()
            return {'success': 'El usuario fue creado'}
        except mysql.connector.Error as err:
            return {'error': f'Error al crear el usuario: {err}'}
        finally:
            cursor.close()
            connection.close()
    else:
        return {'error': 'Todos los campos son requeridos'}

@app.route('/showSignIn')
def showSignIn():
    return render_template('signin.html')

@app.route('/signIn', methods=['POST'])
def signIn():
    correo = request.form['correo']
    contrasenia = request.form['contrasenia']

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario WHERE Correo = %s AND Contrasenia = %s", (correo, contrasenia))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:
        session['userId'] = user['IdUsuario']
        session['nombre'] = user['Nombre']
        return redirect(url_for('profile'))
    else:
        return {'error': 'Correo o contraseña incorrectos'}

@app.route('/profile')
def profile():
    if 'userId' not in session:
        return redirect(url_for('showSignIn'))
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    # Verificar si el perfil está completo
    cursor.execute("SELECT * FROM usuario WHERE IdUsuario = %s", (session['userId'],))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    
    # Campos a validar como necesarios para un perfil completo
    required_fields = ['FechaDeNacimiento', 'Sexo', 'FotoDePerfil']
    
    # Si alguno de estos campos está vacío, se considera incompleto
    if any(user[field] is None or user[field] == '' for field in required_fields):
        return render_template('profile.html', nombre=session.get('nombre'), message="Por favor, completa tu perfil.")
    
    # Perfil completo, mostrar la página normal de perfil
    return render_template('profile.html', nombre=session.get('nombre'))

@app.route('/match')
def match():
    if 'userId' not in session:
        return redirect(url_for('showSignIn'))
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    # Verificar si el perfil está completo
    cursor.execute("SELECT * FROM usuario WHERE IdUsuario = %s", (session['userId'],))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    
    # Si el perfil no está completo, redirigir al perfil o mostrar un mensaje
    required_fields = ['FechaDeNacimiento', 'Sexo', 'FotoDePerfil']
    if any(user[field] is None or user[field] == '' for field in required_fields):
        return redirect(url_for('profile'))
    
    # Si el perfil está completo, permitir acceso a la página de 'match'
    return render_template('match.html')


@app.route('/api/gustos')
def api_gustos():
    connection = get_db_connection()
    cursor = connection.cursor()

    # Obtener todas las columnas de la tabla `gustos_musicales`
    cursor.execute("SHOW COLUMNS FROM gustos_musicales;")
    columns = [column[0] for column in cursor.fetchall()]

    # Excluir las columnas `idGustos` y `gustos_IdUsuario`
    selected_columns = [col for col in columns if col not in ('idGustos', 'gustos_IdUsuario')]

    # Crear el query dinámico
    query = f"SELECT {', '.join(selected_columns)} FROM gustos_musicales;"
    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    connection.close()

    # Convertir los resultados a una lista de diccionarios para enviar como JSON
    gustos = [dict(zip(selected_columns, row)) for row in result]

    return jsonify(gustos)

@app.route('/api/guardar_gustos', methods=['POST'])
def guardar_gustos():
    if 'userId' not in session:
        return {'error': 'No se ha iniciado sesión.'}, 401

    data = request.get_json()
    gustos = data.get('gustos')

    if not gustos:
        return {'error': 'No se proporcionaron gustos.'}, 400

    connection = get_db_connection()
    cursor = connection.cursor()

    for genero, afinidad in gustos.items():
        # Usar un query de actualización (UPDATE) para guardar el valor de afinidad
        query = f"UPDATE gustos_musicales SET {genero} = %s WHERE gustos_IdUsuario = %s"
        cursor.execute(query, (afinidad, session['userId']))

    connection.commit()
    cursor.close()
    connection.close()

    return {'success': 'Gustos guardados correctamente.'}

app.run(debug=True)




# os.urandom(24).hex()
# app.secret_key = "7c999aba887aebbdabee377185ea21cff5eeebec1cc748e9"  # Necesario para usar sesiones

# print(app.secret_key)

# EXEMPT_ROUTES = [
# 	'/showSignUp',
# 	'/showSignIn',
# 	'/signUp',
# 	'/signIn',
# 	'/validateLogin',
# 	'/static/signup.css',
# 	'/static/signIn.css',
# ]

# def authenticateSession():
# 	if 'username' in session:
# 		user = session["username"]
# 		return True
# 	else:
# 		return redirect('/showSignIn')

# @app.before_request
# def before_request():
# 	if request.path not in EXEMPT_ROUTES:
# 		result = authenticateSession()
# 		if result is not True:
# 			return result

# @app.route("/logout")
# def logout():
# 	session.clear()
# 	return redirect("/")

# def get_db_connection():
# 	return mysql.connector.connect(
# 		host="192.168.30.69",
# 		user="g6-agustiniv",
# 		password="GNkYL)T[bL3OwZHK",
# 		database="g6-agustiniv",
# 		collation="utf8mb3_general_ci",
# 	)


# @app.route('/showSignUp')
# def showSignUp():
# 	return render_template('signup.html')

# @app.route('/signUp', methods=['POST'])
# def signUp():
# 	_name = request.form['inputName']
# 	_email = request.form['inputEmail']
# 	_password = request.form['inputPassword']
	
# 	if _name and _email and _password:
# 		data = create_user(_name, _password, _email)

# 		if (data[3] == "Usuario ya existe"):
# 			return {'error': 'El Usuario ya existe'}
		
# 		dataValidacion = validate_user_login(_email, _password)
# 		if dataValidacion[2]:
# 			session['userId'] = dataValidacion[3]
# 			session['email'] = _email
# 			session['username'] = dataValidacion[4]
# 		else:
# 			return {'error': 'El Mail o la Contraseña no coinciden'}
# 		return{'success': 'El Usuario fue creado'}
# 	else:
# 		if not _name:
# 			return {'error': 'Ingrese un Nombre de Usuario'}
# 		elif not _email:
# 			return {'error': 'Ingrese un Email valido'}
# 		elif not _password:
# 			return {'error': 'Ingrese una contraseña valida'}

# @app.route('/showSignIn')
# def showSignIn():
# 	return render_template('signIn.html')

# @app.route('/validateLogin', methods=['POST'])
# def validateLogin():
# 	_email = request.form['inputEmail']
# 	_password = request.form['inputPassword']
	
# 	data = validate_user_login(_email, _password)
# 	if data[2]:
# 		session['userId'] = data[3]
# 		session['email'] = _email
# 		session['username'] = data[4]
# 		return {'success': 'Logueado'}
# 	else:
# 		return {'error': 'El Mail o la Contraseña no coinciden'}

# def validate_user_login(email, password):
# 	conn = get_db_connection()
# 	try:
# 		with conn.cursor() as cursor:
# 			data = cursor.callproc('sp_validateLogin', (email, password, 0, 0, 'hola'))
# 			return data
# 	except Exception as e:
# 		conn.rollback()
# 		print("Error:", e)
# 		raise e
# 	finally:
# 		conn.close()
 
# def create_user(name, password, email):
# 	conn = get_db_connection()
# 	data = None
# 	try:
# 		with conn.cursor() as cursor:
# 			data = cursor.callproc('sp_createUser', (name, password, email, ''))
# 			conn.commit()
# 		return data
# 	except Exception as e:
# 		conn.rollback()
# 		print("Error:", e)
# 		raise e
# 	finally:
# 		conn.close()

# @app.route('/getNotas')
# def getNotasUsuario():
# 	userId = session['userId']
# 	conn = get_db_connection()
# 	with conn.cursor() as cursor:
# 		cursor.execute("""
# 			SELECT id, DATE_FORMAT(fecha_nota, '%m-%d-%Y') as fecha_nota, descripcion, importe, tipo FROM nota
# 			WHERE user_id = %s
# 			;
# 			""", ([userId]))
# 		return cursor.fetchall()
# 	conn.close()

# @app.route('/createNota', methods=['POST'])
# def create_nota():
# 	data = request.get_json() 
# 	fecha = data['fecha']
# 	descripcion = data['descripcion']
# 	importe = data['importe']
# 	tipo = data['tipo']
# 	print(importe)
	
# 	conn = get_db_connection()
# 	try:
# 		with conn.cursor() as cursor:
# 			cursor.callproc('sp_createNota', (session["userId"], fecha, descripcion, str(importe), tipo))
# 			conn.commit()
# 		return 'Nota creada', 200
# 	except Exception as e:
# 		conn.rollback()
# 		print("Error:", e)
# 		return str(e), 500 
# 	finally:
# 		conn.close()

# @app.route('/deleteNota', methods=['POST'])
# def delete_nota():
# 	data = request.get_json()
# 	id = data['id']
# 	conn = get_db_connection()
# 	try:
# 		with conn.cursor() as cursor:
# 			cursor.callproc('sp_deleteNota', (id, session["userId"]))
# 			conn.commit()
# 		return 'Nota eliminada', 200
# 	except Exception as e:
# 		conn.rollback()
# 		print("Error:", e)
# 		return str(e), 500 
# 	finally:
# 		conn.close()

# @app.route("/")
# def main():
# 	notas = getNotasUsuario()
# 	return render_template('calendar.html', notas=notas)

# app.run(debug=True)