import 'dart:io';
import 'dart:typed_data';
import 'package:auto_attend/attendance/wifi_search.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:flutter_face_api/flutter_face_api.dart';

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

class AuthFace extends StatefulWidget {
  const AuthFace({super.key});
  @override
  _AuthFaceState createState() => _AuthFaceState();
}

class _AuthFaceState extends State<AuthFace> {
  bool isProcessing = true;
  bool match = false;
  bool upload = false;
  MatchFacesImage? mfImage1;
  MatchFacesImage? mfImage2;
  var faceSdk = FaceSDK.instance;
  var _status = "nil";
  var _similarityStatus = "nil";
  var _livenessStatus = "nil";
  final ImagePicker _picker = ImagePicker();
  late Future<Database> database;
  setImage(Uint8List bytes, ImageType type, int number) {
    _similarityStatus = "nil";
    var mfImage = MatchFacesImage(bytes, type);
    if (number == 1) {
      mfImage1 = mfImage;
      _similarityStatus = "nil";
    }
    if (number == 2) {
      mfImage2 = mfImage;
    }
  }

  matchFaces() async {
    if (mfImage1 == null || mfImage2 == null) {
      _status = "Both images required!";
      return false;
    }
    _status = "Processing...";
    var request = MatchFacesRequest([mfImage1!, mfImage2!]);
    var response = await faceSdk.matchFaces(request);
    var split = await faceSdk.splitComparedFaces(response.results, 0.50); //0.75
    var match = split.matchedFaces;
    _similarityStatus = "failed";
    if (match.isNotEmpty) {
      print("here");
      _similarityStatus = "${(match[0].similarity * 100).toStringAsFixed(2)}%";
    }
    setState(() {
      _similarityStatus = _similarityStatus;
    });
    print(_similarityStatus);
    _status = "Ready";
  }

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

  Future<List<User>> dogs() async {
    // Get a reference to the database.
    final Database db = await database;
    // Query the table for all the dogs.
    final List<Map<String, Object?>> dogMaps = await db.query('USER');
    if (dogMaps.isEmpty) {
      return [];
    }
    return [
      for (final {
            'id': id as int,
            'name': name as String,
            'classId': classId as int,
            'image': image as Uint8List,
          } in dogMaps)
        User(id: id, name: name, classId: classId, image: image),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Auth'),
      ),
      body: Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              ElevatedButton(
                  onPressed: () async {
                    upload = true;
                    final XFile? image =
                        await _picker.pickImage(source: ImageSource.camera);
                    if (image != null) {
                      setState(() {
                        _image = image;
                      });
                    }
                    await openDB();
                    final List<User> userList = await dogs();
                    if (userList.isEmpty) {
                      print("No users");
                    }
                    setImage(userList[0].image, ImageType.EXTERNAL, 1);
                    print(userList[0].toString());
                    setImage(
                        File(image!.path).readAsBytesSync(), ImageType.LIVE, 2);
                    await matchFaces();
                    isProcessing = false;
                    if (_similarityStatus == "failed") {
                      print("No match");
                    } else {
                      print("Match found");
                      match = true;
                      Navigator.push(
                        // ignore: use_build_context_synchronously
                        context,
                        MaterialPageRoute(
                            builder: (context) => const wifiSearch()),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text('User Auth')),
              const SizedBox(height: 20),
              _image != null
                  ? Image.file(File(_image!.path), height: 200, width: 200)
                  : const Text('No image selected.'),
              const SizedBox(height: 20),
              Text(
                isProcessing && upload ? "Processing" : "Upload an image",
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                match ? "Match Found" : "",
                style: const TextStyle(
                  color: Colors.green,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ]),
      ),
    );
  }

  XFile? _image;
}
