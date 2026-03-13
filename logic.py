from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

def init_db():
    conn = sqlite3.connect('user.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                   password TEXT NOT NULL)''')
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS tasks(
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   user_id INTEGER NOT NULL,
                   taskText TEXT NOT NULL,
                   deadline TEXT NOT NULL,
                   FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    conn.commit()
    conn.close()

init_db()

@app.route("/get_tasks", methods=['GET'])
def get_tasks():
    user_id = request.args.get('user_id')
    conn = sqlite3.connect('user.db')
    cursor = conn.cursor()

    cursor.execute('SELECT taskText, deadline FROM tasks WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    
    tasks_list = []

    for row in rows:
        task = row[0]
        deadline = row[1]
        print(task, deadline)
        deadline_time = datetime.strptime(deadline, "%Y-%m-%d")
        now = datetime.now()
        time_left = deadline_time - now
        seconds = int(time_left.total_seconds())

        days = seconds // 86400
        hours = (seconds % 86400) // 3600
        minutes = (seconds % 3600) // 60

        tasks_list.append({
            "taskText": task,
            "deadline": deadline,
            "time_left": f"{days}д {hours}ч {minutes}м"
        })

    return jsonify(tasks_list)


@app.route("/logic", methods=['POST'])
def savetasks():
    data = request.get_json()
    user_id = data.get('user_id')
    task_text = data.get('taskContainer')
    deadline = data.get('deadline')
    deadline_time = datetime.strptime(deadline, "%Y-%m-%d")
    now = datetime.now()
    time_left = deadline_time - now
    seconds = int(time_left.total_seconds())

    days = seconds // 86400
    hours = (seconds % 86400) // 3600
    minutes = (seconds % 3600) // 60
    time_left_str = f"{days}д {hours}ч {minutes}м"
    conn = None
    try:
        conn = sqlite3.connect('user.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO tasks (user_id, taskText, deadline) VALUES (?, ?, ?)', (user_id, task_text, deadline)) 
        conn.commit()
        return jsonify({
            "taskText": task_text,
            "deadline": deadline,
            "time_left": time_left_str
        }), 201
    except Exception as e:
        print(f"ПОДРОБНАЯ ОШИБКА: {e}")
        return jsonify({"message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route("/delete", methods=['POST'])
def deletetask():
    data = request.get_json()
    task = data.get("taskContainer")
    deadline = data.get("data")

    print("получил задачу "+task)

    conn = None
    try:
        conn = sqlite3.connect('user.db')
        cursor = conn.cursor()

        cursor.execute('DELETE FROM tasks WHERE taskText = ?', (task,))
        conn.commit()
        return jsonify({"message": "Задача успешно удалена!"}), 201
    except Exception as e:
        print(f"ПОДРОБНАЯ ОШИБКА: {e}")
        return jsonify({"message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route("/registr", methods=['POST'])
def registr():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    print(username, password)
    conn = None
    try:
        conn = sqlite3.connect('user.db')
        cursor = conn.cursor()

        cursor.execute('INSERT INTO users (username, password) VALUES (?,?)', (username, password))
        conn.commit()
        print(f'Успешно зарегистрирован {username}')
        return jsonify({"message": f"Пользователь {username} зарегистрирован в базе данных!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "Ошибка: этот логин уже занят"}), 400
    except Exception as e:
        return jsonify({"message": f"Произошла ошибка: {str(e)}"}), 500
    
    finally:
        if conn:
            conn.close()

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    conn = None
    try:
        conn = sqlite3.connect('user.db')
        cursor = conn.cursor()

        cursor.execute('SELECT password FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()  

        if user != None:
            if password==user[0]:
                cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
                user_id = cursor.fetchone()[0]
                return jsonify({
            "message": "Успешный вход!",
            "user_id": user_id,
            "username": username
            }), 200
            else:return jsonify({"message": "Неправильный пароль!"})
        else:
            return jsonify({"message": "Данный пользователь не зарегистрирован!"})
    except Exception as e:
        return jsonify({"message": f"Произошла ошибка: {str(e)}"}), 500
    
    finally:
        if conn:
            conn.close()



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)