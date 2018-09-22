/*
Name: Akshath Jain
Date: 9/22/18
Purpose: log the user in, b/c we care about "security"
*/

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';

class LoginScreen extends StatefulWidget{
  @override
  createState() => new _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>{
  TextEditingController _ucontroller;
  TextEditingController _pcontroller;  

  @override
  void initState(){
    _ucontroller = new TextEditingController();
    _pcontroller = new TextEditingController();
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text("Flow"),
      ),
      body: new Container(
        margin: const EdgeInsets.only(left: 32.0, right: 32.0),
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              TextField(
                decoration: InputDecoration(
                  hintText: "Username"
                ),
                controller: _ucontroller,
              ),
              TextField(
                decoration: InputDecoration(
                  hintText: "Password",
                ),
                obscureText: true,
                controller:  _pcontroller,
              ),
              SizedBox(height: 20.0,),
              Row(
                children: <Widget>[
                  RaisedButton(
                    child: Text("LOGIN"),
                    onPressed: (){
                      print(_ucontroller.text);
                      print(_pcontroller.text);
                      String username = _ucontroller.text;
                      String pswd = _ucontroller.text;
                      var url = "http://localhost:3000/login/";
                      http.post(
                        url,
                        body: {
                          "username":username,
                          "password":pswd,
                        }
                      ).then((response){
                        if(response.statusCode == 200)
                          print('success');
                        else{
                          print('you failed');
                          print(response.statusCode);
                        }
                      }); 
                    },
                  ),
                ],
              ),
            ],
          )
        ),
      ),
    );
  }
}

Future<Map> loginStuff(String username, String pswd) async{
  
}