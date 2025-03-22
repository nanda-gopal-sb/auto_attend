import 'dart:io';
import 'dart:typed_data';
import 'package:auto_attend/pages/home.dart';
//import 'package:auto_attend/attendance/wifi_search.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class User {
  final int id;
  final String name;
  final int classId;
  final Uint8List image;
  const User({
    required this.id,
    required this.name,
    required this.classId,
    required this.image,
  });
  Map<String, Object?> toMap() {
    return {
      'id': id,
      'name': name,
      'classId': classId,
      'image': image,
    };
  }

  String convertToString() {
    return 'id: $id, name: $name, classId: $classId, image: $image';
  }
}

class Registerface extends StatefulWidget {
  const Registerface({super.key});
  @override
  // ignore: library_private_types_in_public_api
  _RegisterfaceState createState() => _RegisterfaceState();
}

class _RegisterfaceState extends State<Registerface> {
  final ImagePicker _picker = ImagePicker();
  late Future<Database> database;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _classController = TextEditingController();
  final TextEditingController _collegeIdController = TextEditingController();
  Future<void> openDB() async {
    database = openDatabase(
      join(await getDatabasesPath(), 'test6.db'),
      onCreate: (db, version) {
        return db.execute(
          'CREATE TABLE USER(id INTEGER PRIMARY KEY, name TEXT, classId INTEGER, image BLOB)',
        );
      },
      version: 1,
    );
    print('Database opened');
  }

  // Future<List<User>> dogs() async {
  //   // Get a reference to the database.
  //   final Database db = await database;
  //   // Query the table for all the dogs.
  //   final List<Map<String, Object?>> dogMaps = await db.query('dogs');
  //   if (dogMaps.isEmpty) {
  //     //print("No dogs");
  //     return [];
  //   }
  //   // for (final dog in dogMaps) {
  //   //   print(dog);
  //   // }
  //   // Convert the list of each dog's fields into a list of `Dog` objects.
  //   return [
  //     for (final {
  //           'id': id as int,
  //           'name': name as String,
  //           'classId': classId as int,
  //           'image': image as Uint8List,
  //         } in dogMaps)
  //       User(id: id, name: name, classId: classId, image: image),
  //   ];
  // }

  Future<void> insertDog(User dog) async {
    final Database db = await database;
    int id = await db.insert(
      'USER',
      dog.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
    //print(id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register Face'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: _classController,
              decoration: const InputDecoration(labelText: 'Class'),
            ),
            TextField(
              controller: _collegeIdController,
              decoration: const InputDecoration(labelText: 'College ID'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                final XFile? image =
                    await _picker.pickImage(source: ImageSource.gallery);
                if (image != null) {
                  setState(() {
                    _image = image;
                  });
                }
              },
              child: const Text('Select Image'),
            ),
            const SizedBox(height: 20),
            _image != null
                ? Image.file(File(_image!.path), height: 200, width: 200)
                : const Text('No image selected.'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                if (_image != null) {
                  try {
                    final User dog = User(
                      id: int.parse(_collegeIdController.text),
                      name: _nameController.text,
                      classId: int.parse(_classController.text),
                      image: await File(_image!.path).readAsBytes(),
                    );
                    await openDB();
                    print(dog.convertToString());
                    await insertDog(dog);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const HomeNavigation()),
                    );
                  } catch (e) {
                    //print('Error: $e');
                  }
                } else {
                  //print('No image selected.');
                }
              },
              child: const Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }

  XFile? _image;
}
