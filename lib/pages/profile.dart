import 'package:flutter/material.dart';
import 'package:auto_attend/database/utils.dart';
import '../database/user.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  List<User> _users = [];

  @override
  void initState() {
    _fetchUsers();
    super.initState();
  }

  Future<void> _fetchUsers() async {
    print("LMAO");
    final userMaps = await DatabaseHelper.instance.queryAllUsers();
    setState(() {
      _users = userMaps.map((userMap) => User.fromMap(userMap)).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Center(
        child: _users.isEmpty
            ? const CircularProgressIndicator()
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: Image.memory(_users[0].image).image,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    _users[0].username,
                    style: const TextStyle(
                        fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Student ID: ${_users[0].id}',
                    style: const TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      // Add logout functionality here
                    },
                    child: const Text('Logout'),
                  ),
                ],
              ),
      ),
    );
  }
}
