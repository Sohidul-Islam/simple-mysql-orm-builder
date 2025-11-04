Here’s a professional and clear **README.md** for your `QueryBuilder` class:

---

````markdown
# 🧩 QueryBuilder – A Lightweight MySQL Query Builder in JavaScript

This is a lightweight **SQL Query Builder** written in plain JavaScript. It allows you to easily construct **SELECT**, **INSERT**, **UPDATE**, and **DELETE** queries dynamically using a clean, chainable API — without manually concatenating SQL strings.

---

## 🚀 Features

- Build SQL queries using a **fluent, chainable API**
- Supports:
  - `SELECT` with `JOIN`, `WHERE`, `GROUP BY`, `ORDER BY`, and `LIMIT`
  - `INSERT` with key-value objects
  - `UPDATE` with key-value objects and conditions
  - `DELETE` with conditions
- Automatically escapes string values with quotes
- Resets state after each query build
- Returns a `Query` object with `.toString()` for final SQL string output

---

## 🧱 Class Structure

### `Query`
A simple wrapper class that stores the final query string and provides a `toString()` method.

### `QueryBuilder`
Handles all SQL query construction logic with methods like `select()`, `from()`, `where()`, `insertInto()`, `update()`, and `deleteFrom()`.

---

## 📖 Usage Examples

### 1️⃣ SELECT Query
```js
const selectQuery = new QueryBuilder()
  .select({ userId: 'u.id', userName: 'u.name' })
  .from('users u')
  .leftJoin('orders o', 'o.user_id = u.id')
  .where({ 'u.status': 'active', 'o.amount': 100 })
  .groupBy('u.id')
  .orderBy('u.name', 'ASC')
  .limit(10)
  .build();

console.log(selectQuery.toString());
````

**Output:**

```sql
SELECT u.id AS userId, u.name AS userName FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.status = 'active' AND o.amount = '100' GROUP BY u.id ORDER BY u.name ASC LIMIT 10;
```

---

### 2️⃣ INSERT Query

```js
const insertQuery = new QueryBuilder()
  .insertInto('users', { name: 'John Doe', email: 'john@example.com', status: 'active' })
  .build();

console.log(insertQuery.toString());
```

**Output:**

```sql
INSERT INTO users (name, email, status) VALUES ('John Doe', 'john@example.com', 'active');
```

---

### 3️⃣ UPDATE Query

```js
const updateQuery = new QueryBuilder()
  .update('users', { status: 'inactive', email: 'inactive@example.com' })
  .where({ id: 5 })
  .build();

console.log(updateQuery.toString());
```

**Output:**

```sql
UPDATE users SET status = 'inactive', email = 'inactive@example.com' WHERE id = '5';
```

---

### 4️⃣ DELETE Query

```js
const deleteQuery = new QueryBuilder()
  .deleteFrom('users')
  .where({ id: 10 })
  .build();

console.log(deleteQuery.toString());
```

**Output:**

```sql
DELETE FROM users WHERE id = '10';
```

---

## 🧠 Notes & Tips

* Multiple `.where()` calls will chain using **AND**.
* You can use **raw string conditions**:

  ```js
  .where("u.age > 18")
  .where("u.role LIKE '%admin%'")
  ```
* `groupBy`, `orderBy`, and `limit` are optional and can be used as needed.
* Each call to `.build()` automatically resets the builder for the next query.

---

## 📦 Example Output Summary

| Operation  | Example                                                                |
| ---------- | ---------------------------------------------------------------------- |
| **SELECT** | `SELECT id, name FROM users WHERE status = 'active';`                  |
| **INSERT** | `INSERT INTO users (name, email) VALUES ('John', 'john@example.com');` |
| **UPDATE** | `UPDATE users SET name = 'John' WHERE id = 1;`                         |
| **DELETE** | `DELETE FROM users WHERE id = 1;`                                      |

---

## 🧰 Future Enhancements

* Support for `INNER JOIN`, `RIGHT JOIN`, `FULL JOIN`
* Parameterized queries for SQL injection safety
* Support for nested `WHERE` conditions (e.g., `OR`, parentheses)
* Built-in query validation and formatter

---

## 🪪 License

MIT License © 2025 — Created by **Sohidul Islam**

---
