(function (exports) {

  'use strict';

  function debug(str) {
    console.log("CJC CLIENT SHIM -*- -->" + str);
  }

  //Client side
  function Port(iacPort) {
    debug('Creando recubrimiento de puertos');
    this.iacPort = iacPort;
    this.iacPort.onmessage = e => {
      this.onmessage && this.onmessage(e);
    };
    this.iacPort.start();
  }

  Port.prototype = {
    postMessage: function postMessage(msg) {
      debug('Sending a message');
      this.iacPort && this.iacPort.postMessage(msg);
    },

    set onmessage(fc) {
      this.iacPort.onmessage = evt => fc(evt);
    }
  };

  var connectShim = function(where) {
    return new Promise((resolve, reject) => {
      if (!where) {
        reject('where connect unknow');
      }
      var request = navigator.mozApps.getSelf();
      request.onsuccess = domReq => {
        var app = domReq.target.result;
        if (!app.connect) {
          reject("we don't have iac");
        }
        app.connect(where).then(
          ports => {
            debug('Establecida comunicacion IAC');
            if (ports && ports.length > 0) {
              var shimPort = new Port(ports[0]);
              //resolve(shimPort);
              shimPort.onmessage = function(evt) {
                shimPort.onmessage = null;
                evt.data.accepted && resolve(shimPort) || reject();
              };
            }
          },
          reason => {
            reject(reason);
          }
        );
      };

      request.onerror = domReq => {
        debug('CJC error retrieved self' + JSON.stringify(domReq.error));
        reject(domReq.error);
      };
    });
  };

  debug('CJC !!!! navigatorConnect se ejecuta!!!');
  exports.navigator.connect = !exports.navigator.connect && connectShim || undefined;

})(window);
