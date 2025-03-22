import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:auto_attend/database/utils.dart';
import '../database/user.dart';
import '../database/global.dart';

class StudentHandler extends StatefulWidget {
  const StudentHandler({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _StudentHandlerState createState() => _StudentHandlerState();
}

class _StudentHandlerState extends State<StudentHandler> {
  List<User> _users = [];

  @override
  void initState() {
    _fetchUsers();
    super.initState();
  }

  Future<void> _fetchUsers() async {
    final userMaps = await DatabaseHelper.instance.queryAllUsers();
    setState(() {
      _users = userMaps.map((userMap) => User.fromMap(userMap)).toList();
    });
  }

  void postData() async {
    final singleStudentUrl = Uri.parse('$url/getSingleStudent');
    final singleStudentResponse = await http.post(
      singleStudentUrl,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'student_id': '${_users[0].id}',
      }),
    );
    if (singleStudentResponse.statusCode >= 200 &&
        singleStudentResponse.statusCode <= 299) {
      final responseBody = jsonDecode(singleStudentResponse.body);
      print('Single student data: $responseBody');
      final response = await http.post(
        Uri.parse('$url/addStudentForAttendance'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'student_id': '${_users[0].id}',
          'student_name': '${responseBody[0]['student_name']}'
        }),
      );
    }
  }

  Future<bool> _onWillPop() async {
    Navigator.of(context).popUntil((route) => route.isFirst);
    return false;
  }

  @override
  Widget build(BuildContext context) {
    // ignore: deprecated_member_use
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Attendance'),
        ),
        body: Center(
          child: Column(
            children: [
              ElevatedButton(
                onPressed: () {
                  postData();
                },
                child: const Text('Mark Attendance'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
