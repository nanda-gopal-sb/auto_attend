import 'dart:convert';
import 'package:auto_attend/attendance/landing_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class StudentHandler extends StatefulWidget {
  const StudentHandler({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _StudentHandlerState createState() => _StudentHandlerState();
}

class _StudentHandlerState extends State<StudentHandler> {
  Map<String, dynamic>? firstObject;
  Map<String, dynamic>? changedObject;
  Future<void> fetchData() async {
    final response = await http.get(Uri.parse('https://true.loca.lt'));
    if (response.statusCode >= 200 || response.statusCode <= 299) {
      setState(() {
        List<dynamic> data = json.decode(response.body);
        if (data.isNotEmpty) {
          changedObject = data[0];
          print(changedObject.toString());
        } else {
          firstObject?['Subject'] = 'Not Found';
          firstObject?['Teacher'] = 'Not Found';
          firstObject?['Class'] = 'Not Found';
          firstObject?['Attendance'] = 'Not Found';
        }
      });
    } else {
      // ignore: avoid_print
      print("Not found");
      throw Exception('Failed to fetch data');
    }
  }

  void changeRoute() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const LandingPage()),
    );
  }

  void changeData() {
    setState(() {
      firstObject = changedObject;
    });
  }

  void postData() async {
    final url = Uri.parse('https://true.loca.lt');
    if (firstObject?['Attendance'] == 'Not Found') {
      return;
    }
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(
          <String, String>{'student_id': "123", 'student_name': "nandu"}),
    );
    if (response.statusCode >= 200 || response.statusCode <= 299) {
      // Request successful
      print('POST request successful');
    } else {
      // Request failed
      print('Failed to make POST request');
    }
  }

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Attendance'),
        ),
        body: Center(
          child: Column(
            children: [
              SizedBox(
                width: 200,
                child: Card(
                  color: Colors.cyan,
                  elevation: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Text('Subject: ${firstObject?['Subject']}'),
                        Text('Teacher: ${firstObject?['Teacher']}'),
                        Text('Class: ${firstObject?['Class']}'),
                      ],
                    ),
                  ),
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  postData();
                },
                child: const Text('Mark Attendance'),
              ),
            ],
          ),
        ));
  }
}
