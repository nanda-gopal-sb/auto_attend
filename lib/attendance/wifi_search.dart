// ignore_for_file: depend_on_referenced_packages, camel_case_types

import 'package:auto_attend/attendance/student_handler.dart';
import 'package:wifi_scan/wifi_scan.dart';
import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

bool espPresent = false;

class wifiSearch extends StatefulWidget {
  const wifiSearch({super.key});
  @override
  State<wifiSearch> createState() => _wifiSearchState();
}

class _wifiSearchState extends State<wifiSearch> {
  late List accessPoints;

  void _getScannedResults() async {
    // check platform support and necessary requirements
    final can =
        await WiFiScan.instance.canGetScannedResults(askPermissions: true);
    if (can case CanGetScannedResults.yes) {
      accessPoints = await WiFiScan.instance.getScannedResults();
      for (int i = 0; i < accessPoints.length; i++) {
        if (accessPoints[i].ssid == 'ESP32 WiFI AP') {
          espPresent = true;
          break;
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    _getScannedResults();
    if (espPresent) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const StudentHandler()),
      );
    }
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.blue,
          title: const Text('Auto Attend'),
        ),
        body: Column(
          children: [
            const SizedBox(height: 180),
            Center(
              child: LoadingAnimationWidget.newtonCradle(
                color: Colors.black,
                size: 250,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Searching for WiFi...',
              style: TextStyle(
                fontSize: 20,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
