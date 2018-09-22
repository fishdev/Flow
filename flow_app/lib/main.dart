import 'package:flutter/material.dart';
import 'login.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:async';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
   return new MaterialApp(
      title: "Flow",
      debugShowCheckedModeBanner: false,
      home: RaisedButton(
        child: Text("PRESS FOR IMMERSIVE EXPERIENCE"),
        onPressed: _launchURL,
      ),
    );
  }

  _launchURL() async {
    const url = 'http://localhost:3000';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}