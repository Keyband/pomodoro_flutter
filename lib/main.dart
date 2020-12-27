// Don't forget to credit the icon: https://www.flaticon.com/free-icon/tomato_1412511?related_item_id=1413626&term=tomato
// BG image: https://www.pexels.com/photo/red-tomatoes-on-board-2899682/
// Link teaching some things about the glassmorphism: https://www.youtube.com/watch?v=mCyVx2rwd-U
// Font used: https://fonts.google.com/specimen/Montserrat
import 'dart:ui';
import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pomodoro Flutter',
      theme: ThemeData(
        primarySwatch: Colors.red,
        fontFamily: 'Montserrat',
      ),
      home: MyHomePage(title: 'Pomodoro Flutter'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  Timer _timer = Timer.periodic(Duration(days: 1), (timer) {});
  int pomodoroTime = 0;

  void startTimer({int startTimeInSeconds: 500}) {
    pomodoroTime = startTimeInSeconds;
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        pomodoroTime--;
        if (pomodoroTime <= 0) {
          _timer.cancel();
        }
      });
    });
  }

  void pauseTimer() {
    _timer.cancel();
  }

  void unpauseTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        pomodoroTime--;
        if (pomodoroTime <= 0) {
          _timer.cancel();
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        // appBar: AppBar(
        //   title: Text(widget.title),
        // ),
        body: Stack(fit: StackFit.expand, children: <Widget>[
      Container(
        padding: EdgeInsets.all(64),
        decoration: BoxDecoration(
            image: DecorationImage(
                image: AssetImage('assets/images/bg.jpg'), fit: BoxFit.cover)),
      ),
      Container(color: Colors.white.withOpacity(0.2)),
      Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                GlassPanel(
                  child: Container(
                    child: AutoSizeText(
                      'Pomodoro Glass',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w300,
                      ),
                      minFontSize: 16,
                      maxFontSize: 32,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
                GlassPanel(
                  child: Container(
                    child: AutoSizeText(
                      '${(pomodoroTime / 60).floor().toString().padLeft(2, '0')}:${(pomodoroTime.remainder(60)).toString().padLeft(2, '0')}',
                      style: TextStyle(fontSize: 22),
                      minFontSize: 16,
                      maxFontSize: 32,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                )
              ],
            ),
            GlassButton(
                text: 'Start',
                callbackFunction: () {
                  startTimer();
                }),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Container(
                    child: GlassButton(
                  text: _timer.isActive ? 'Pause' : 'Unpause',
                  callbackFunction: pauseTimer,
                )),
                Container(child: GlassButton(text: 'Stop'))
              ],
            )
          ],
        ),
      ),
      // )
    ]));
  }
}

class GlassButton extends StatelessWidget {
  final String text;
  // final Function callbackFunction;
  final VoidCallback callbackFunction;
  static void defaultCallback() {
    print('Callback não definido.');
  }

  GlassButton({this.text: 'Jonas', this.callbackFunction: defaultCallback});

  @override
  Widget build(BuildContext context) {
    return GlassPanel(
        child: RaisedButton(
      elevation: 0,
      color: Colors.red[600],
      onPressed: callbackFunction,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Colors.red[400])),
      child: AutoSizeText(
        text,
        style: TextStyle(
            fontSize: 36, fontWeight: FontWeight.w300, color: Colors.black),
      ),
    ));
  }
}

class GlassPanel extends StatelessWidget {
  final bool bExpandAndCenter;
  final Widget child;
  GlassPanel(
      {this.bExpandAndCenter: true, this.child: const Text('Glass Panel')});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(8),
      decoration: BoxDecoration(boxShadow: [
        BoxShadow(
            blurRadius: 128,
            spreadRadius: 8,
            color: Colors.black.withOpacity(0.3))
      ]),
      // child: Container(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
          child: Container(
              decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: <Color>[
                      Colors.white.withOpacity(0.3),
                      Colors.white.withOpacity(0.15)
                    ],
                  ),
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                      width: 2, color: Colors.white.withOpacity(0.2))),
              child: bExpandAndCenter
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: child,
                      ),
                    )
                  : Padding(padding: const EdgeInsets.all(8.0), child: child)),
        ),
      ),
      // ),
    );
  }
}
