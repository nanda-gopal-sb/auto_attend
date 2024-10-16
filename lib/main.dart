// import 'dart:io';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'dart:async';
// import 'package:flutter_face_api/flutter_face_api.dart';
// import 'package:image_picker/image_picker.dart';

// void main() => runApp(const MaterialApp(home: MyApp()));

// class _MyAppState extends State<MyApp> {
//   var faceSdk = FaceSDK.instance;

//   var _status = "nil";
//   var _similarityStatus = "nil";
//   var _livenessStatus = "nil";
//   var _uiImage1 = Image.asset('assets/images/portrait.png');
//   var _uiImage2 = Image.asset('assets/images/portrait.png');

//   set status(String val) => setState(() => _status = val);
//   set similarityStatus(String val) => setState(() => _similarityStatus = val);
//   set livenessStatus(String val) => setState(() => _livenessStatus = val);
//   set uiImage1(Image val) => setState(() => _uiImage1 = val);
//   set uiImage2(Image val) => setState(() => _uiImage2 = val);

//   MatchFacesImage? mfImage1;
//   MatchFacesImage? mfImage2;

//   void init() async {
//     super.initState();
//     if (!await initialize()) return;
//     status = "Ready";
//   }

//   startLiveness() async {
//     var result = await faceSdk.startLiveness(
//       config: LivenessConfig(skipStep: [LivenessSkipStep.ONBOARDING_STEP]),
//       notificationCompletion: (notification) {
//         print(notification.status);
//       },
//     );
//     if (result.image == null) return;
//     setImage(result.image!, ImageType.LIVE, 1);
//     livenessStatus = result.liveness.name.toLowerCase();
//   }

//   matchFaces() async {
//     if (mfImage1 == null || mfImage2 == null) {
//       status = "Both images required!";
//       return;
//     }
//     status = "Processing...";
//     var request = MatchFacesRequest([mfImage1!, mfImage2!]);
//     var response = await faceSdk.matchFaces(request);
//     var split = await faceSdk.splitComparedFaces(response.results, 0.75);
//     var match = split.matchedFaces;
//     similarityStatus = "failed";
//     if (match.isNotEmpty) {
//       similarityStatus = "${(match[0].similarity * 100).toStringAsFixed(2)}%";
//     }
//     status = "Ready";
//   }

//   clearResults() {
//     status = "Ready";
//     similarityStatus = "nil";
//     livenessStatus = "nil";
//     uiImage2 = Image.asset('assets/images/portrait.png');
//     uiImage1 = Image.asset('assets/images/portrait.png');
//     mfImage1 = null;
//     mfImage2 = null;
//   }

//   // If 'assets/regula.license' exists, init using license(enables offline match)
//   // otherwise init without license.
//   Future<bool> initialize() async {
//     status = "Initializing...";
//     var license = await loadAssetIfExists("assets/regula.license");
//     InitConfig? config;
//     if (license != null) config = InitConfig(license);
//     var (success, error) = await faceSdk.initialize(config: config);
//     if (!success) {
//       status = error!.message;
//       print("${error.code}: ${error.message}");
//     }
//     return success;
//   }

//   Future<ByteData?> loadAssetIfExists(String path) async {
//     try {
//       return await rootBundle.load(path);
//     } catch (_) {
//       return null;
//     }
//   }

//   setImage(Uint8List bytes, ImageType type, int number) {
//     similarityStatus = "nil";
//     var mfImage = MatchFacesImage(bytes, type);
//     if (number == 1) {
//       mfImage1 = mfImage;
//       uiImage1 = Image.memory(bytes);
//       livenessStatus = "nil";
//     }
//     if (number == 2) {
//       mfImage2 = mfImage;
//       uiImage2 = Image.memory(bytes);
//     }
//   }

//   Widget useGallery(int number) {
//     return textButton("Use gallery", () async {
//       Navigator.pop(context);
//       var image = await ImagePicker().pickImage(source: ImageSource.gallery);
//       if (image != null) {
//         setImage(File(image.path).readAsBytesSync(), ImageType.PRINTED, number);
//       }
//     });
//   }

//   Widget useCamera(int number) {
//     return textButton("Use camera", () async {
//       Navigator.pop(context);
//       var response = await faceSdk.startFaceCapture();
//       var image = response.image;
//       if (image != null) setImage(image.image, image.imageType, number);
//     });
//   }

//   Widget image(Image image, Function() onTap) => GestureDetector(
//         onTap: onTap,
//         child: Image(height: 150, width: 150, image: image.image),
//       );

//   Widget button(String text, Function() onPressed) {
//     return SizedBox(
//       width: 250,
//       child: textButton(text, onPressed,
//           style: ButtonStyle(
//             backgroundColor: WidgetStateProperty.all<Color>(Colors.black12),
//           )),
//     );
//   }

//   Widget text(String text) => Text(text, style: TextStyle(fontSize: 18));
//   Widget textButton(String text, Function() onPressed, {ButtonStyle? style}) =>
//       TextButton(
//         onPressed: onPressed,
//         style: style,
//         child: Text(text),
//       );

//   setImageDialog(BuildContext context, int number) => showDialog(
//         context: context,
//         builder: (BuildContext context) => AlertDialog(
//           title: const Text("Select option"),
//           actions: [useGallery(number), useCamera(number)],
//         ),
//       );

//   @override
//   Widget build(BuildContext bc) {
//     return Scaffold(
//       appBar: AppBar(title: Center(child: Text(_status))),
//       body: Container(
//         margin: EdgeInsets.fromLTRB(0, 0, 0, MediaQuery.of(bc).size.height / 8),
//         width: double.infinity,
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: <Widget>[
//             image(_uiImage1, () => setImageDialog(bc, 1)),
//             image(_uiImage2, () => setImageDialog(bc, 2)),
//             Container(margin: const EdgeInsets.fromLTRB(0, 0, 0, 15)),
//             button("Match", () => matchFaces()),
//             button("Liveness", () => startLiveness()),
//             button("Clear", () => clearResults()),
//             Container(margin: const EdgeInsets.fromLTRB(0, 15, 0, 0)),
//             Row(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 text("Similarity: $_similarityStatus"),
//                 Container(margin: EdgeInsets.fromLTRB(20, 0, 0, 0)),
//                 text("Liveness: $_livenessStatus")
//               ],
//             )
//           ],
//         ),
//       ),
//     );
//   }

//   @override
//   void initState() {
//     super.initState();
//     SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
//     init();
//   }
// }

// class MyApp extends StatefulWidget {
//   const MyApp({super.key});

//   @override
//   // ignore: library_private_types_in_public_api
//   _MyAppState createState() => _MyAppState();
// }
// // import 'dart:async';

// // import 'package:flutter/foundation.dart';
// // import 'package:flutter/material.dart';
// // import 'package:wifi_scan/wifi_scan.dart';

// // void main() {
// //   runApp(const MyApp());
// // }

// // /// Example app for wifi_scan plugin.
// // class MyApp extends StatefulWidget {
// //   /// Default constructor for [MyApp] widget.
// //   const MyApp({Key? key}) : super(key: key);

// //   @override
// //   State<MyApp> createState() => _MyAppState();
// // }

// // class _MyAppState extends State<MyApp> {
// //   List<WiFiAccessPoint> accessPoints = <WiFiAccessPoint>[];
// //   StreamSubscription<List<WiFiAccessPoint>>? subscription;
// //   bool shouldCheckCan = true;

// //   bool get isStreaming => subscription != null;

// //   Future<void> _startScan(BuildContext context) async {
// //     // check if "can" startScan
// //     if (shouldCheckCan) {
// //       // check if can-startScan
// //       final can = await WiFiScan.instance.canStartScan();
// //       // if can-not, then show error
// //       if (can != CanStartScan.yes) {
// //         if (context.mounted) kShowSnackBar(context, "Cannot start scan: $can");
// //         return;
// //       }
// //     }

// //     // call startScan API
// //     final result = await WiFiScan.instance.startScan();
// //     if (context.mounted) kShowSnackBar(context, "startScan: $result");
// //     // reset access points.
// //     setState(() => accessPoints = <WiFiAccessPoint>[]);
// //   }

// //   Future<bool> _canGetScannedResults(BuildContext context) async {
// //     if (shouldCheckCan) {
// //       // check if can-getScannedResults
// //       final can = await WiFiScan.instance.canGetScannedResults();
// //       // if can-not, then show error
// //       if (can != CanGetScannedResults.yes) {
// //         if (context.mounted) {
// //           kShowSnackBar(context, "Cannot get scanned results: $can");
// //         }
// //         accessPoints = <WiFiAccessPoint>[];
// //         return false;
// //       }
// //     }
// //     return true;
// //   }

// //   Future<void> _getScannedResults(BuildContext context) async {
// //     if (await _canGetScannedResults(context)) {
// //       // get scanned results
// //       final results = await WiFiScan.instance.getScannedResults();
// //       setState(() => accessPoints = results);
// //     }
// //   }

// //   Future<void> _startListeningToScanResults(BuildContext context) async {
// //     if (await _canGetScannedResults(context)) {
// //       subscription = WiFiScan.instance.onScannedResultsAvailable
// //           .listen((result) => setState(() => accessPoints = result));
// //     }
// //   }

// //   void _stopListeningToScanResults() {
// //     subscription?.cancel();
// //     setState(() => subscription = null);
// //   }

// //   @override
// //   void dispose() {
// //     super.dispose();
// //     // stop subscription for scanned results
// //     _stopListeningToScanResults();
// //   }

// //   // build toggle with label
// //   Widget _buildToggle({
// //     String? label,
// //     bool value = false,
// //     ValueChanged<bool>? onChanged,
// //     Color? activeColor,
// //   }) =>
// //       Row(
// //         children: [
// //           if (label != null) Text(label),
// //           Switch(value: value, onChanged: onChanged, activeColor: activeColor),
// //         ],
// //       );

// //   @override
// //   Widget build(BuildContext context) {
// //     return MaterialApp(
// //       home: Scaffold(
// //         appBar: AppBar(
// //           title: const Text('Plugin example app'),
// //           actions: [
// //             _buildToggle(
// //                 label: "Check can?",
// //                 value: shouldCheckCan,
// //                 onChanged: (v) => setState(() => shouldCheckCan = v),
// //                 activeColor: Colors.purple)
// //           ],
// //         ),
// //         body: Builder(
// //           builder: (context) => Padding(
// //             padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
// //             child: Column(
// //               mainAxisSize: MainAxisSize.max,
// //               crossAxisAlignment: CrossAxisAlignment.start,
// //               children: [
// //                 Row(
// //                   mainAxisAlignment: MainAxisAlignment.spaceEvenly,
// //                   children: [
// //                     ElevatedButton.icon(
// //                       icon: const Icon(Icons.perm_scan_wifi),
// //                       label: const Text('SCAN'),
// //                       onPressed: () async => _startScan(context),
// //                     ),
// //                     ElevatedButton.icon(
// //                       icon: const Icon(Icons.refresh),
// //                       label: const Text('GET'),
// //                       onPressed: () async => _getScannedResults(context),
// //                     ),
// //                     _buildToggle(
// //                       label: "STREAM",
// //                       value: isStreaming,
// //                       onChanged: (shouldStream) async => shouldStream
// //                           ? await _startListeningToScanResults(context)
// //                           : _stopListeningToScanResults(),
// //                     ),
// //                   ],
// //                 ),
// //                 const Divider(),
// //                 Flexible(
// //                   child: Center(
// //                     child: accessPoints.isEmpty
// //                         ? const Text("NO SCANNED RESULTS")
// //                         : ListView.builder(
// //                             itemCount: accessPoints.length,
// //                             itemBuilder: (context, i) =>
// //                                 _AccessPointTile(accessPoint: accessPoints[i])),
// //                   ),
// //                 ),
// //               ],
// //             ),
// //           ),
// //         ),
// //       ),
// //     );
// //   }
// // }

// // /// Show tile for AccessPoint.
// // ///
// // /// Can see details when tapped.
// // class _AccessPointTile extends StatelessWidget {
// //   final WiFiAccessPoint accessPoint;

// //   const _AccessPointTile({super.key, required this.accessPoint});

// //   // build row that can display info, based on label: value pair.
// //   Widget _buildInfo(String label, dynamic value) => Container(
// //         decoration: const BoxDecoration(
// //           border: Border(bottom: BorderSide(color: Colors.grey)),
// //         ),
// //         child: Row(
// //           children: [
// //             Text(
// //               "$label: ",
// //               style: const TextStyle(fontWeight: FontWeight.bold),
// //             ),
// //             Expanded(child: Text(value.toString()))
// //           ],
// //         ),
// //       );

// //   @override
// //   Widget build(BuildContext context) {
// //     final title = accessPoint.ssid.isNotEmpty ? accessPoint.ssid : "**EMPTY**";
// //     final signalIcon = accessPoint.level >= -80
// //         ? Icons.signal_wifi_4_bar
// //         : Icons.signal_wifi_0_bar;
// //     return ListTile(
// //       visualDensity: VisualDensity.compact,
// //       leading: Icon(signalIcon),
// //       title: Text(title),
// //       subtitle: Text(accessPoint.capabilities),
// //       onTap: () => showDialog(
// //         context: context,
// //         builder: (context) => AlertDialog(
// //           title: Text(title),
// //           content: Column(
// //             mainAxisSize: MainAxisSize.min,
// //             children: [
// //               _buildInfo("BSSDI", accessPoint.bssid),
// //               _buildInfo("Capability", accessPoint.capabilities),
// //               _buildInfo("frequency", "${accessPoint.frequency}MHz"),
// //               _buildInfo("level", accessPoint.level),
// //               _buildInfo("standard", accessPoint.standard),
// //               _buildInfo(
// //                   "centerFrequency0", "${accessPoint.centerFrequency0}MHz"),
// //               _buildInfo(
// //                   "centerFrequency1", "${accessPoint.centerFrequency1}MHz"),
// //               _buildInfo("channelWidth", accessPoint.channelWidth),
// //               _buildInfo("isPasspoint", accessPoint.isPasspoint),
// //               _buildInfo(
// //                   "operatorFriendlyName", accessPoint.operatorFriendlyName),
// //               _buildInfo("venueName", accessPoint.venueName),
// //               _buildInfo("is80211mcResponder", accessPoint.is80211mcResponder),
// //             ],
// //           ),
// //         ),
// //       ),
// //     );
// //   }
// // }

// // /// Show snackbar.
// // void kShowSnackBar(BuildContext context, String message) {
// //   if (kDebugMode) print(message);
// //   ScaffoldMessenger.of(context)
// //     ..hideCurrentSnackBar()
// //     ..showSnackBar(SnackBar(content: Text(message)));
// // }
import 'package:flutter/material.dart';
import 'attendance/landing_page.dart';

void main() {
  runApp(const AutoAttend());
}

class AutoAttend extends StatelessWidget {
  const AutoAttend({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Auto Attend',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LandingPage(),
    );
  }
}
