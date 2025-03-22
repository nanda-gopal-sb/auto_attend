import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'user.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._instance();
  static Database? _database;

  DatabaseHelper._instance();

  Future<Database> get db async {
    _database ??= await initDb();
    return _database!;
  }

  Future<Database> initDb() async {
    String databasesPath = await getDatabasesPath();
    String path = join(databasesPath, 'attendance2.db');
    return await openDatabase(path, version: 1, onCreate: _onCreate);
  }

  Future<bool> isDatabaseCreated() async {
    String databasesPath = await getDatabasesPath();
    String path = join(databasesPath, 'attendance2.db');
    return databaseExists(path);
  }

  Future _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE students (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT,
        image BLOB
      )
    ''');
  }

  Future<List<Map<String, dynamic>>> queryAllUsers() async {
    Database db = await instance.db;
    return await db.query('students');
  }

  Future<int> insertUser(User user) async {
    Database db = await instance.db;
    return await db.insert('students', user.toMap());
  }
}
