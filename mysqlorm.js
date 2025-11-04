class Query {
  constructor(queryString) {
    this.query = queryString;
  }

  toString() {
    return this.query;
  }
}

class QueryBuilder {
  constructor() {
    this._reset();
  }

  _reset() {
    this._type = null;
    this._selectFields = [];
    this._fromTable = '';
    this._joins = [];
    this._where = [];
    this._orderBy = '';
    this._limit = '';
    this._groupBy = '';
    this._insertTable = '';
    this._insertValues = null;
    this._updateTable = '';
    this._updateValues = null;
    this._deleteTable = '';
  }

  // ----- SELECT -----
  select(fields = ['*']) {
    this._type = 'SELECT';
    if (Array.isArray(fields)) {
      this._selectFields.push(...fields);
    } else if (typeof fields === 'object') {
      for (const [alias, value] of Object.entries(fields)) {
        this._selectFields.push(`${value} AS ${alias}`);
      }
    } else {
      this._selectFields.push(fields);
    }
    return this;
  }

  from(tableName) {
    this._fromTable = tableName;
    return this;
  }

  leftJoin(table, condition) {
    this._joins.push(`LEFT JOIN ${table} ON ${condition}`);
    return this;
  }

  where(condition) {
    if (typeof condition === 'string') {
      this._where.push(condition);
    } else if (typeof condition === 'object') {
      for (const [key, value] of Object.entries(condition)) {
        this._where.push(`${key} = '${value}'`);
      }
    }
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this._orderBy = `ORDER BY ${field} ${direction}`;
    return this;
  }

  groupBy(field) {
    this._groupBy = `GROUP BY ${field}`;
    return this;
  }

  limit(count, offset = null) {
    this._limit = offset !== null ? `LIMIT ${offset}, ${count}` : `LIMIT ${count}`;
    return this;
  }

  // ----- INSERT -----
  insertInto(table, values) {
    this._type = 'INSERT';
    this._insertTable = table;
    this._insertValues = values;
    return this;
  }

  // ----- UPDATE -----
  update(table, values) {
    this._type = 'UPDATE';
    this._updateTable = table;
    this._updateValues = values;
    return this;
  }

  // ----- DELETE -----
  deleteFrom(table) {
    this._type = 'DELETE';
    this._deleteTable = table;
    return this;
  }

  // ----- BUILD QUERY -----
  build() {
    let queryString = '';

    switch (this._type) {
      case 'SELECT':
        const selectClause = this._selectFields.length
          ? `SELECT ${this._selectFields.join(', ')}`
          : 'SELECT *';
        const fromClause = `FROM ${this._fromTable}`;
        const joinClause = this._joins.join(' ');
        const whereClause = this._where.length ? `WHERE ${this._where.join(' AND ')}` : '';
        queryString = `${selectClause} ${fromClause} ${joinClause} ${whereClause} ${this._groupBy} ${this._orderBy} ${this._limit};`;
        break;

      case 'INSERT':
        const keys = Object.keys(this._insertValues).join(', ');
        const vals = Object.values(this._insertValues)
          .map((v) => `'${v}'`)
          .join(', ');
        queryString = `INSERT INTO ${this._insertTable} (${keys}) VALUES (${vals});`;
        break;

      case 'UPDATE':
        const setClause = Object.entries(this._updateValues)
          .map(([k, v]) => `${k} = '${v}'`)
          .join(', ');
        const whereUpdate = this._where.length ? `WHERE ${this._where.join(' AND ')}` : '';
        queryString = `UPDATE ${this._updateTable} SET ${setClause} ${whereUpdate};`;
        break;

      case 'DELETE':
        const whereDelete = this._where.length ? `WHERE ${this._where.join(' AND ')}` : '';
        queryString = `DELETE FROM ${this._deleteTable} ${whereDelete};`;
        break;

      default:
        throw new Error('Query type not defined.');
    }

    const finalQuery = queryString.trim();
    const queryObj = new Query(finalQuery);
    this._reset(); // reset for next chain
    return queryObj;
  }
}

// ---------------------------
// Example Usages
// ---------------------------

// SELECT Example
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

// INSERT Example
const insertQuery = new QueryBuilder()
  .insertInto('users', { name: 'John Doe', email: 'john@example.com', status: 'active' })
  .build();

console.log(insertQuery.toString());

// UPDATE Example
const updateQuery = new QueryBuilder()
  .update('users', { status: 'inactive', email: 'inactive@example.com' })
  .where({ id: 5 })
  .build();

console.log(updateQuery.toString());

// DELETE Example
const deleteQuery = new QueryBuilder()
  .deleteFrom('users')
  .where({ id: 10 })
  .build();

console.log(deleteQuery.toString());



