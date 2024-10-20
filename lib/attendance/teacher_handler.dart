import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:auto_attend/attendance/landing_page.dart';
import 'package:flutter/material.dart';

class TeacherHandler extends StatefulWidget {
  const TeacherHandler({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _TeacherHandlerState createState() => _TeacherHandlerState();
}

class _TeacherHandlerState extends State<TeacherHandler> {
  Map<String, dynamic>? changedObject;
  void postData() async {
    final url = Uri.parse('https://true.loca.lt');
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'Subject': "Maths",
        'Teacher': "Raju",
        'Class': "IT-B",
        'Attendance': "True"
      }),
    );
    if (response.statusCode == 200) {
      // Request successful
      print('POST request successful');
    } else {
      // Request failed
      print('Failed to make POST request');
    }
  }

  void getData() async {
    final url = Uri.parse('https://true.loca.lt');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      // Request successful
      print('GET request successful');
    } else {
      // Request failed
      print('Failed to make GET request');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LandingPage()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Back'),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              onPressed: () {
                postData();
              },
              child: const Text('Start Attendance'),
            ),
          ],
        ),
      ),
    );
  }
}
