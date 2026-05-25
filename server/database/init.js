const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/inference_logger.db');

function initDatabase() {
    // Ensure data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const db = new Database(DB_PATH);

    // Enable WAL mode for better concurrent read/write performance
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Read and execute schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    db.exec(schema);

    console.log('Database initialized successfully at:', DB_PATH);
    return db;
}

// Singleton pattern
let dbInstance = null;

function getDatabase() {
    if (!dbInstance) {
        dbInstance = initDatabase();
    }
    return dbInstance;
}

module.exports = { getDatabase, initDatabase };
