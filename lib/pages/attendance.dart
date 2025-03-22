import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:auto_attend/database/utils.dart';
import 'package:auto_attend/attendance/wifi_search.dart';
import '../database/user.dart';
import 'package:http/http.dart' as http;
import '../database/global.dart';

void main() {
  runApp(AttendanceApp());
}

class AttendanceApp extends StatelessWidget {
  const AttendanceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: AttendancePage(),
    );
  }
}

class AttendancePage extends StatefulWidget {
  const AttendancePage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _AttendancePageState createState() => _AttendancePageState();
}

class _AttendancePageState extends State<AttendancePage> {
  late List<bool> _isExpanded;
  var subjects = [];
  bool _showWifiSearch = false;
  List<User> _users = [];
  @override
  void initState() {
    getSubjects();
    super.initState();
    print(subjects.length);
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
      Uri.parse('$url/allSubjects'),
      body: {'student_id': _users[0].id.toString()},
    );
    final subjects = jsonDecode(response.body);
    print(subjects);
    setState(() {
      this.subjects = subjects;
      _isExpanded = List<bool>.filled(subjects.length, false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
      ),
      body: _showWifiSearch ? _buildWifiSearchBody() : _buildAttendanceBody(),
    );
  }

  Widget _buildAttendanceBody() {
    return ListView.builder(
      itemCount: subjects.length,
      itemBuilder: (context, index) {
        final subject = subjects[index];
        return ExpansionPanelList(
          elevation: 1,
          expandedHeaderPadding: const EdgeInsets.all(0),
          expansionCallback: (int item, bool isExpanded) {
            setState(() {
              _isExpanded[index] = !_isExpanded[index];
            });
          },
          children: [
            ExpansionPanel(
              headerBuilder: (BuildContext context, bool isExpanded) {
                return ListTile(
                  title: Text(subject['subject_name']!),
                );
              },
              body: Padding(
                padding: const EdgeInsets.all(16.0),
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _showWifiSearch = true; // Switch to WiFi search
                    });
                  },
                  child: const Text('Send Attendance'),
                ),
              ),
              isExpanded: _isExpanded[index],
            ),
          ],
        );
      },
    );
  }

  Widget _buildWifiSearchBody() {
    return const wifiSearch();
  }
}
