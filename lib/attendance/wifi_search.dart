// ignore_for_file: depend_on_referenced_packages, camel_case_types

import 'package:auto_attend/attendance/student_handler.dart';
import 'package:wifi_scan/wifi_scan.dart';
import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

class wifiSearch extends StatefulWidget {
  const wifiSearch({super.key});
  @override
  State<wifiSearch> createState() => _wifiSearchState();
}

class _wifiSearchState extends State<wifiSearch> {
  bool espPresent = false;
  List<WiFiAccessPoint> accessPoints = [];
  @override
  void initState() {
    super.initState();
    _getScannedResults();
  }

  void _getScannedResults() async {
    // check platform support and necessary requirements
    final can = await WiFiScan.instance.canGetScannedResults();
    if (can == CanGetScannedResults.yes) {
      print("Scanning");
      accessPoints = await WiFiScan.instance.getScannedResults();
      print(accessPoints.length);
      for (int i = 0; i < accessPoints.length; i++) {
        print(accessPoints[i].ssid);
        if (accessPoints[i].ssid == 'MAC') {
          espPresent = true;
          break;
        }
      }
      if (espPresent) {
        Navigator.push(
          // ignore: use_build_context_synchronously
          context,
          MaterialPageRoute(builder: (context) => const StudentHandler()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
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
