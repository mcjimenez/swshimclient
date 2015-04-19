(function(exports) {

  'use strict';

  function debug(str) {
    console.log("CJC -*-:" + str);
  }

  var _evtSectionEntries = document.getElementById('eventsEntries');
  var _imgSection = document.getElementById('imgSection');
  var _select = document.getElementById('selectIcon');


  function changeSelect(evt) {
    //client.postMessage({ icon : _select.options[_select.selectedIndex].value });
    debug("_select.selectedIndex:"+_select.selectedIndex);
    debug("selected:"+_select.options[_select.selectedIndex].value);
    _putImg({src:_select.options[_select.selectedIndex].value});
  }
  function _putImg(aImg) {
    if (!aImg || !aImg.src) {
      return;
    }
    var img = document.createElement('img');
//    var imageURL = window.URL.createObjectURL(aImg.src);
    var imageURL = aImg.src;
    img.src = imageURL;
    aImg.alt && img.setAttribute('alt', aImg.alt);
    while (_imgSection.hasChildNodes()){
      _imgSection.removeChild(_imgSection.childNodes[0]);
    };
    _imgSection.appendChild(img);
  }

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

        for (var i = 0; i < NUM_MSG; i++) {
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

  window.addEventListener('load', function () {
    debug('APP Document loaded! --> registrar handlers de prueba');
    _select.addEventListener('change', changeSelect);
    _select.selectedIndex = 0;
    _putImg({src:_select.options[_select.selectedIndex].value});
  });
})(this);
