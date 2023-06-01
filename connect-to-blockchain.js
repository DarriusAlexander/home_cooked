(function() {
  var obj = {};
  obj.locale = null;
  obj.internal = {};

  obj.getInfo = function(category) {
    if (category === 'name') {
      return 'Get Token Price';
    } else if (category === 'description') {
      return 'Get the current price of a token from Coinbase.';
    } else if (category === 'author') {
      return 'Keiji Agusa';
    } else if (category === 'help') {
      return 'Displays the current price of a token in the object.';
    } else if (category === 'parameter') {
      return [];
    } else if (category === 'internal') {
      return obj.internal;
    } else if (category === 'actionCommand') {
      return [
        {
          id: 1,
          name: 'Get Token Price',
          description: 'Displays the current price of a token in the object',
          parameter: [
            { id: 1, name: 'Variable:', type: 'SwitchVariableObjectId', option: ['SelfObject'], defaultValue: -1 },
            { id: 101, name: '', type: 'VariableId', referenceId: 1, withNewButton: true, defaultValue: -1 },
          ],
        },
      ];
    }
    return null;
  };

  obj.initialize = function(settings) {};

  obj.finalize = function() {};

  obj.setLocale = function(_locale) {
    obj.locale = _locale;
  };

  obj.setInternal = function(settings) {};

  obj.call = function(name, param1, param2) {};

  obj.execActionCommand = function(index, valueJson, objectId, instanceId, actionId, commandId) {
    var xObjId = valueJson[0].value;
    var xVarId = valueJson[1].value;
    var variable = null;
    var instance = Agtk.objectInstances.get(instanceId);
    if (xObjId === Agtk.constants.switchVariableObjects.ProjectCommon) {
      variable = Agtk.variables.get(xVarId);
    } else if (xObjId === Agtk.constants.switchVariableObjects.SelfObject) {
      variable = instance.variables.get(xVarId);
    } else if (xObjId === Agtk.constants.switchVariableObjects.ParentObject) {
      var parentInstanceId = instance.variables.get(Agtk.constants.objects.variables.ParentObjectInstanceIDId);
      var parentInstance = Agtk.objectInstances.get(parentInstanceId);
      variable = parentInstance.variables.get(xVarId);
    }
    if (variable !== null) {
      var apiKey = 'Okqbs0LZoU8VQuBi';
      var apiSecret = 'R0jfzLVvua2FnCRIfFeVMMqM8CsuRxCe';
      var baseUrl = 'https://api.coinbase.com/v2';
      var tokenSymbol = 'TOKEN_SYMBOL';

      loadScript('https://unpkg.com/axios/dist/axios.min.js', function() {
        var timestamp = Date.now() / 1000;
        var signature = CryptoJS.HmacSHA256(timestamp + 'GET' + '/v2/prices/' + tokenSymbol + '-USD', apiSecret).toString(CryptoJS.enc.Hex);

        axios.get(baseUrl + '/prices/' + tokenSymbol + '-USD', {
            headers: {
              'CB-ACCESS-KEY': apiKey,
              'CB-ACCESS-SIGN': signature,
              'CB-ACCESS-TIMESTAMP': timestamp,
            }
          })
          .then(function(response) {
            var data = response.data.data;
            if (data && data.amount) {
              variable.setValue(parseFloat(data.amount));
            }
          })
          .catch(function(error) {
            console.error('Error:', error);
          });
      });
    }
  };

  obj.update = function(dt) {};

  return obj;
})();
