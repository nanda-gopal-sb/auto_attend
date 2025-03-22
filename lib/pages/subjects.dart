import 'dart:convert';

import 'package:flutter/material.dart';
import '../database/global.dart';
import 'package:auto_attend/database/utils.dart';
import '../database/user.dart';
import 'package:http/http.dart' as http;

class SubjectsPage extends StatefulWidget {
  const SubjectsPage({super.key});

  @override
  State<SubjectsPage> createState() => _SubjectsPageState();
}

class _SubjectsPageState extends State<SubjectsPage> {
  List<User> _users = [];
  var subjects = [];
  @override
  void initState() {
    getSubjects();
    super.initState();
  }

  Future<void> _fetchUsers() async {
    final userMaps = await DatabaseHelper.instance.queryAllUsers();
    setState(() {
      _users = userMaps.map((userMap) => User.fromMap(userMap)).toList();
    });
  }

  Future<void> getSubjects() async {
    await _fetchUsers();
    final response = await http.post(
      Uri.parse('$url/getAttendanceDetails'),
      body: {'student_id': _users[0].id.toString()},
    );
    final subjects = jsonDecode(response.body);
    print(subjects);
    setState(() {
      this.subjects = subjects;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enrolled Subjects'),
      ),
      body: ListView.builder(
        itemCount: subjects.length,
        itemBuilder: (context, index) {
          final subject = subjects[index];
          return ListTile(
            title: Text(subject['subject_name']!),
            subtitle: Text(
              '${subject['present_count']}/${subject['total_classes']}',
              style: const TextStyle(fontSize: 19.0),
            ),
            trailing: Text(
              '${subject['attendance_percentage'].toString().split('.')[0]}%',
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 18.0),
            ),
          );
        },
      ),
    );
  }
}
