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

  @override
  void initState() {
    getSubjects();
    super.initState();
  }

  Future<void> _fetchUsers() async {
    print("fetching users");
    final userMaps = await DatabaseHelper.instance.queryAllUsers();
    setState(() {
      _users = userMaps.map((userMap) => User.fromMap(userMap)).toList();
    });
    print(_users[0].id);
  }

  Future<void> getSubjects() async {
    print("getting subjects");
    await _fetchUsers();
    final response = await http.post(
      Uri.parse('$url/getAttendanceDetails'),
      body: {'student_id': _users[0].id.toString()},
    );
    print(response.body);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enrolled Subjects'),
      ),
      // body: ListView.builder(
      //   itemCount: subjects.length,
      //   itemBuilder: (context, index) {
      //     final subject = subjects[index];
      //     return ListTile(
      //       title: Text(subject['name']!),
      //       subtitle: Text('ID: ${subject['id']}'),
      //     );
      //   },
      // ),
    );
  }
}
