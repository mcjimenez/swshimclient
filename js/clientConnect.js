(function(exports) {

  'use strict';

  function debug(str) {
    console.log("CJC -*-:" + str);
  }

  var _evtSectionEntries = document.getElementById('events-entries');

  function _addTxt(txt) {
    var li = document.createElement('li');
    li.innerHTML = txt;
    _evtSectionEntries.appendChild(li);
  }

  var TXT_MSG = 'Testing message';
  var URL_CONNECT = 'https://testServiceConnect.hostedweb.tid.es/services';
  var NUM_MSG = 5;

  var ClientConnect = function() {
    var self = this;
    debug('CLIENT Vamos a lanzar conexion');
    navigator.connect(URL_CONNECT).then(
      function(port) {
        self.port = port;
        _addTxt("navigator.connect success. Adding listener!");

        port.onmessage = function(evt) {
          // Handle reply from the service.
          debug('CLIENT msg received --> ' + JSON.stringify(evt.data));
          _addTxt(evt.data ? JSON.stringify(evt.data): "no datas");
        };

        for (var i = 0; i < 1 /*NUM_MSG*/; i++) {
          debug('CLIENT Send msg ' + i);
          port.postMessage({'origin': 'client', 'secuence': i});
        }
    });
  };

  ClientConnect.prototype = {
    postMessage: function pm(msg) {
      this.port.postMessage(msg);
    }
  };

  var client = new ClientConnect();
  exports.clientConnect = client;

})(this);
