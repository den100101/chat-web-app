from werkzeug.security import generate_password_hash

# USERS

class User:
    TABLE = 'users'

    @staticmethod
    def add_user(cursor,Email,Username,Password):
        hashed_password = generate_password_hash(Password)
        cursor.execute(f'INSERT INTO {User.TABLE} (Email,Username,Password) VALUES (%s,%s,%s)',(Email, Username, hashed_password))

    @staticmethod
    def change_password(cursor,Password,user_id):
        hashed_password = generate_password_hash(Password)
        cursor.execute(f'Update {User.TABLE} SET Password = %s WHERE id = %s', (hashed_password, user_id))

    @staticmethod
    def get_all_users(cursor):
        cursor.execute(f"SELECT id,Email,Username,Roles FROM {User.TABLE}")
        all_users = cursor.fetchall()
        return all_users
    
    @staticmethod
    def delete_user(cursor,user_id):
        cursor.execute(f"DELETE FROM {User.TABLE} WHERE id = %s", (user_id,))

#TASKS

class Task:
    TABLE = 'tasks'

    @staticmethod
    def add_task(cursor,tasks,description,due_date,priority):
        cursor.execute(f'INSERT INTO {Task.TABLE} (tasks,description,due_date,priority) VALUES (%s,%s,%s,%s)',(tasks,description,due_date,priority))

    @staticmethod
    def get_tasks(cursor):
        cursor.execute(f'SELECT id, tasks, description, due_date, priority, status FROM {Task.TABLE}')
        tasks = cursor.fetchall()
        return tasks

    @staticmethod
    def completed_task(cursor,status,task_id):
        cursor.execute(f'UPDATE {Task.TABLE} SET status = %s WHERE id= %s', (status,task_id))

    @staticmethod
    def update_task(cursor,tasks,description,due_date,priority,user_id):
        cursor.execute(f'UPDATE {Task.TABLE} SET tasks = %s,description = %s,due_date = %s,priority =%s WHERE id = %s',(tasks,description,due_date,priority,user_id))
    
    @staticmethod
    def delete_tasks(cursor, user_id):
        cursor.execute(f'DELETE  FROM {Task.TABLE} WHERE id= %s',(user_id,))

# MESSAGES

class Message:
    TABLE ='messages'

    @staticmethod
    def create(cursor, sender_id, content):
        cursor.execute(
            f"INSERT INTO {Message.TABLE}(sender_id, content) VALUES (%s, %s)",
            (sender_id, content)
        )

    @staticmethod
    def get_all(cursor):
        cursor.execute(f"SELECT * FROM {Message.TABLE} ORDER BY created_at DESC")
        return cursor.fetchall()

    @staticmethod
    def add_content(cursor,sender_id,receiver_id,content):
        cursor.execute(f'INSERT INTO {Message.TABLE} (sender_id,receiver_id,content) VALUES (%s,%s,%s)', (sender_id,receiver_id,content,))

    