from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import mysql.connector
import os

app = Flask(__name__)
app.secret_key = os.urandom(24).hex()

# Función para obtener una conexión a la base de datos
def get_db_connection():
    return mysql.connector.connect(
        host="192.168.50.44",
        user="g8-elsublime",
        password="10chegadorcA",
        database="g8-elsublime",
        collation="utf8mb3_general_ci",
    )

# Ruta base redirige al formulario de Sign Up
@app.route('/')
def index():
    return redirect(url_for('show_sign_up'))

# Mostrar el formulario de registro (Sign Up)
@app.route('/signUp', methods=['GET'])
def show_sign_up():
    return render_template('signUp.html')


@app.route('/test')
def test():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT 1")
        user = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()

    return user
    

# Procesar el registro de un nuevo usuario
@app.route('/signUp', methods=['POST'])
def process_sign_up():
    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    correo = request.form.get('correo')
    contrasenia = request.form.get('contrasenia')

    if not all([nombre, apellido, correo, contrasenia]):
        return jsonify({'error': 'Todos los campos son requeridos'}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        # Verificar si el correo ya existe
        cursor.execute("SELECT * FROM usuario WHERE Correo = %s", (correo,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'error': 'El correo ya está registrado'}), 400

        # Crear el nuevo usuario
        cursor.execute(
            "INSERT INTO usuario (Nombre, Apellido, Correo, Contrasenia) VALUES (%s, %s, %s, %s)",
            (nombre, apellido, correo, contrasenia),
        )
        connection.commit()
        user_id = cursor.lastrowid

        # Crear entrada en gustos musicales con valores iniciales
        cursor.execute(
            """
            INSERT INTO gustos_musicales (
                gustos_IdUsuario, Afinidad_Rock, Afinidad_Pop, Afinidad_Hip_Hop,
                Afinidad_Jazz, Afinidad_Blues, Afinidad_Reggae, Afinidad_Salsa,
                Afinidad_Country, Afinidad_Electronica, Afinidad_Funk, Afinidad_R_B,
                Afinidad_Metal, Afinidad_Clasica, Afinidad_Punk, Afinidad_Ska
            ) VALUES (%s, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            """,
            (user_id,),
        )
        connection.commit()

        # Iniciar sesión automáticamente
        session['userId'] = user_id
        session['nombre'] = nombre

        return jsonify({'success': 'Usuario registrado y sesión iniciada'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f'Error al crear el usuario: {err}'}), 500
    finally:
        cursor.close()
        connection.close()



# Mostrar el formulario de inicio de sesión (Sign In)
@app.route('/signIn', methods=['GET'])
def show_sign_in():
    return render_template('signIn.html')

# Procesar el inicio de sesión
@app.route('/signIn', methods=['POST'])
def process_sign_in():
    correo = request.form.get('correo')
    contrasenia = request.form.get('contrasenia')

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT * FROM usuario WHERE Correo = %s AND Contrasenia = %s",
            (correo, contrasenia),
        )
        user = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()

    if user:
        session['userId'] = user['IdUsuario']
        session['nombre'] = user['Nombre']
        return jsonify({'success': 'Logueado correctamente'})
    return jsonify({'error': 'Correo o contraseña incorrectos'})

# Mostrar perfil de usuario
@app.route('/profile', methods=['GET'])
def profile():
    if 'userId' not in session:
        return redirect(url_for('show_sign_in'))

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM usuario WHERE IdUsuario = %s", (session['userId'],))
        user = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()

    if user:
        required_fields = ['FechaDeNacimiento', 'Sexo', 'FotoDePerfil']
        if any(user.get(field) in (None, '') for field in required_fields):
            return render_template(
                'profile.html',
                nombre=session['nombre'],
                message="Por favor, completa tu perfil.",
            )
        return render_template('profile.html', nombre=session['nombre'])
    return redirect(url_for('show_sign_in'))

# Página de búsqueda de matches
@app.route('/match', methods=['GET'])
def match():
    if 'userId' not in session:
        return redirect(url_for('show_sign_in'))

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM usuario WHERE IdUsuario = %s", (session['userId'],))
        user = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()

    if user:
        return render_template('match.html', user=user)
    return redirect(url_for('show_sign_in'))

@app.route('/api/gustos', methods=['GET'])
def obtener_gustos():
    if 'userId' not in session:
        return jsonify({'error': 'Usuario no autenticado'}), 401

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        # Actualiza la consulta para usar la tabla 'gustos_musicales'
        cursor.execute("SELECT * FROM gustos_musicales WHERE gustos_IdUsuario = %s", (session['userId'],))
        gustos = cursor.fetchall()
    finally:
        cursor.close()
        connection.close()

    if not gustos:
        return jsonify({'error': 'No se encontraron gustos para este usuario'}), 404

    # Aquí puedes asegurarte de devolver las claves que deseas, por ejemplo:
    return jsonify(gustos)




if __name__ == '__main__':
    print("Rutas disponibles:")
    for rule in app.url_map.iter_rules():
        print(rule)
    app.run(debug=True)
