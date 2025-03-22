import 'dart:convert';
import 'dart:io';
import 'package:auto_attend/pages/home.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:auto_attend/database/utils.dart';
import 'package:image_picker/image_picker.dart';
import '../database/user.dart';
import '../database/global.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  final ImagePicker _picker = ImagePicker();
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  void initState() {
    checkLoginStatus();
    super.initState();
  }

  checkLoginStatus() {
    DatabaseHelper.instance.isDatabaseCreated().then((isCreated) {
      if (isCreated) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const HomeApp()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreen,
        title: const Text('Auto Attend'),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(16.0),
          constraints: const BoxConstraints(maxWidth: 400),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              const Text(
                'Students Page',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              TextField(
                controller: usernameController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Username',
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Password',
                ),
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
                child: const Text('Select profile picture'),
              ),
              const SizedBox(height: 20),
              _image != null
                  ? Image.file(File(_image!.path), height: 200, width: 200)
                  : const Text('No image selected.'),
              ElevatedButton(
                onPressed: () async {
                  final response = await http.post(
                    Uri.parse('$url/login'),
                    body: {
                      'username': usernameController.text,
                      'password': passwordController.text,
                      'userType': 'student',
                    },
                  );
                  final responseBody = jsonDecode(response.body);
                  if (responseBody['user_id'] != null &&
                      responseBody['user_id'] is int) {
                    final User user = User(
                      id: responseBody['user_id'],
                      username: usernameController.text,
                      password: passwordController.text,
                      image: await File(_image!.path).readAsBytes(),
                    );
                    await DatabaseHelper.instance.initDb();
                    int id = await DatabaseHelper.instance.insertUser(user);
                    print(id);
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const HomeApp()),
                    );
                  }
                },
                child: const Text('Login'),
              ),
            ],
          ),
        ),
      ),
    ));
  }

  XFile? _image;
}
