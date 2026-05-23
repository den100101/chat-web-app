from flask import Flask, jsonify, session, request,send_from_directory
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from config import get_connection
from models import User, Message, Task
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)

socketio = SocketIO(
    app,
    cors_allowed_origins="http://localhost:5173",
    manage_session=False
)

app.secret_key = 'fb5421bfecc40ab63d7f7bea4daa047decf796e4c7426760976a3acd1c5065b3'

app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True
)

@app.route('/add_user', methods=['POST'])
def new_user():
    conn = None
    cursor = None
    try:
        data = request.json

        if not data or not data.get('Email') or not data.get('Username') or not data.get('Password'):
            return jsonify({'error': 'Missing fields'}), 400

        conn = get_connection()
        cursor = conn.cursor()

        User.add_user(
            cursor,
            data['Email'],
            data['Username'],
            data['Password']
        )

        conn.commit()
        return jsonify({'message': 'User created'}), 201

    except Exception:
        return jsonify({'error': 'Server error'}), 500

    finally:
        try:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        except:
            pass


@app.route("/get_users", methods=['GET'])
def get_all_users():
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        all_users = User.get_all_users(cursor)

        if not all_users:
            return jsonify({'message': 'user not found'}), 404

        users = []
        for user in all_users:
            users.append({
                'id': user[0],
                'email': user[1],
                'username': user[2],
                'roles': user[3]
            })

        return jsonify(users)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        try:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        except:
            pass


@app.route("/delete_users/<int:user_id>", methods=['DELETE'])
def delete_users(user_id):
    conn = None
    cursor = None
    try:
        if session.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        conn = get_connection()
        cursor = conn.cursor()

        User.delete_user(cursor, user_id)

        conn.commit()
        return jsonify({'message': 'User deleted'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        try:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        except:
            pass


@app.route('/login', methods=['POST'])
def login():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    username = data['Username'].strip()
    password = data['Password'].strip()

    cursor.execute(
        "SELECT * FROM users WHERE Username = %s",
        (username,)
    )

    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "User not found."}), 401

    stored_hash = user[3]
    role = user[4]

    if not check_password_hash(stored_hash, password):
        return jsonify({"message": "Invalid Password."}), 401

    session['user_id'] = user[0]
    session['username'] = user[2]
    session['role'] = role

    return jsonify({
        "message": "Login successful",
        "role": role,
        "user_id": user[0],
        "username": user[2]
    }), 200


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200


@app.route('/check_session', methods=['GET'])
def check_session():
    print("SESSION CONTENT:", dict(session))

    if 'user_id' in session:
        return jsonify({
            'loggedIn': True,
            'user_id': session['user_id'],
            'username': session['username'],
            'role': session['role']
        }), 200

    return jsonify({'loggedIn': False}), 200


@app.route('/add_tasks', methods=['POST'])
def new_tasks():
    conn = None
    cursor = None
    try:
        data = request.json

        if not data or not data.get('tasks') or not data.get('description') or not data.get('due_date') or not data.get('priority'):
            return jsonify({'message': 'Missing fields'}), 400

        conn = get_connection()
        cursor = conn.cursor()

        Task.add_task(
            cursor,
            data['tasks'],
            data['description'],
            data['due_date'],
            data['priority']
        )

        conn.commit()
        return jsonify({'message': 'Task Added!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        try:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        except:
            pass


@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    tasks = Task.get_tasks(cursor)

    cursor.close()
    conn.close()

    return jsonify(tasks), 200


@app.route('/update_tasks/<int:user_id>', methods=['PATCH'])
def update_task(user_id):
    conn = None
    cursor = None
    try:
        data = request.json

        conn = get_connection()
        cursor = conn.cursor()

        Task.update_task(
            cursor,
            data['tasks'],
            data['description'],
            data['due_date'],
            data['priority'],
            user_id
        )

        conn.commit()
        return jsonify({'message': 'Task updated'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route('/delete_tasks/<int:user_id>', methods=['DELETE'])
def delete_task(user_id):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        Task.delete_tasks(cursor, user_id)

        conn.commit()
        return jsonify({'message': 'Task deleted sucessfully.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route('/completed_tasks/<int:task_id>', methods=['PATCH', 'OPTIONS'])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def completed_task(task_id):
    print("PATCH HIT:", task_id)

    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        Task.completed_task(cursor, "completed", task_id)

        conn.commit()
        return jsonify({'message': 'Updated Successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@socketio.on('join')
def handle_join():
    user_id = session.get('user_id')

    print("JOIN USER:", user_id)

    if not user_id:
        return

    join_room(str(user_id))


@socketio.on('send_message')
def handle_send_message(data):
    conn = None
    cursor = None
    try:
        sender_id = session.get('user_id')

        if not sender_id:
            return

        receiver_id = data['receiver_id']
        content = data['content']

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        Message.add_content(
            cursor,
            sender_id,
            receiver_id,
            content
        )

        conn.commit()

        message_data = {
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'content': content
        }

        emit('receive_message', message_data, room=str(receiver_id))
        emit('receive_message', message_data, room=str(sender_id))

        print("MESSAGE SENT:", message_data)

    except Exception as e:
        print("SOCKET ERROR:", e)

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route('/get_messages/<int:user_id>', methods=['GET'])
def get_messages(user_id):
    conn = None
    cursor = None
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401

        current_user = session['user_id']

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT * FROM messages
            WHERE (sender_id = %s AND receiver_id = %s)
               OR (sender_id = %s AND receiver_id = %s)
            ORDER BY created_at ASC
            """,
            (current_user, user_id, user_id, current_user)
        )

        messages = cursor.fetchall()
        return jsonify(messages), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/get_me', methods=['GET'])
def get_me():

    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    return jsonify({
        'id': session['user_id']
    })

@app.route("/mark_read/<int:user_id>", methods=["POST"])
def mark_read(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE messages
        SET is_read = 1
        WHERE sender_id = %s 
        AND receiver_id = %s 
        AND is_read = 0
    """, (user_id, session["user_id"]))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"success": True})


@app.route("/unread_counts", methods=["GET"])
def unread_counts():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT sender_id, COUNT(*) AS unread
        FROM messages
        WHERE receiver_id = %s AND is_read = 0
        GROUP BY sender_id
    """, (session["user_id"],))

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)

@app.route("/send_image", methods=["POST"])
def send_image():
    try:
        file = request.files["image"]
        receiver_id = int(request.form["receiver_id"])

        import uuid
        filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"

        file.save(f"uploads/{filename}")

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            INSERT INTO messages
            (sender_id, receiver_id, content, type)
            VALUES (%s, %s, %s, %s)
        """

        values = (
            session["user_id"],
            receiver_id,
            filename,
            "image"
        )

        cursor.execute(query, values)
        conn.commit()

        message_id = cursor.lastrowid

        message = {
            "message_id": message_id,
            "sender_id": session["user_id"],
            "receiver_id": receiver_id,
            "content": filename,
            "type": "image"
        }

        socketio.emit("receive_message", message, room=str(receiver_id))
        socketio.emit("receive_message", message, room=str(session["user_id"]))

        cursor.close()
        conn.close()

        return jsonify(message), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
