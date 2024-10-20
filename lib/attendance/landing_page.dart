import 'package:auto_attend/attendance/teacher_handler.dart';
import 'package:auto_attend/auth/authFace.dart';
import 'package:flutter/material.dart';
import 'package:auto_attend/auth/registerFace.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  @override
  void initState() {
    super.initState();
    _checkDatabaseExistence();
  }

  bool _databaseExists = false;
  Future<bool> _checkDatabaseExistence() async {
    final databasePath = join(await getDatabasesPath(), 'test6.db');
    final dbExists = await databaseExists(databasePath);
    setState(() {
      _databaseExists = dbExists;
    });
    return dbExists;
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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                if (_databaseExists == true) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const AuthFace()),
                  );
                } else {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const Registerface()),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Students'),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const TeacherHandler()),
                );
              },
              child: const Text('Teachers'),
            ),
          ],
        ),
      ),
    ));
  }
}
