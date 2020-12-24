// Don't forget to credit the icon: https://www.flaticon.com/free-icon/tomato_1412511?related_item_id=1413626&term=tomato
// BG image: https://www.pexels.com/photo/red-tomatoes-on-board-2899682/
// Link teaching some things about the glassmorphism: https://www.youtube.com/watch?v=mCyVx2rwd-U
import 'dart:ui';

import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pomodoro Flutter',
      theme: ThemeData(
        primarySwatch: Colors.red,
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
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Stack(children: <Widget>[
          Container(
            padding: EdgeInsets.all(64),
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
                image: DecorationImage(
                    image: AssetImage('assets/images/bg.jpg'),
                    fit: BoxFit.cover)),
          ),
          Container(color: Colors.white.withOpacity(0.2)),
          // FittedBox(
          //   fit: BoxFit.none,
          //   alignment: Alignment.center,
          //   child: Container(
          //     color: Colors.black,
          //     width: 100,
          //     height: 100,
          //   ),
          // )
          Center(
            child: Column(),
          )
        ]));
  }
}

class GlassPanel extends StatelessWidget {
  final bool bExpand;
  final Widget child;
  GlassPanel({this.bExpand: true, this.child: const Text('Glass Panel')});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(64),
      decoration: BoxDecoration(boxShadow: [
        BoxShadow(
            blurRadius: 24,
            spreadRadius: 8,
            color: Colors.black.withOpacity(0.2))
      ]),
      child: Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 32, sigmaY: 32),
            child: Container(
                decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                        width: 2, color: Colors.white.withOpacity(0.2))),
                child: bExpand
                    ? Center(
                        child: child,
                      )
                    : Padding(
                        padding: const EdgeInsets.all(8.0), child: child)),
          ),
        ),
      ),
    );
  }
}
