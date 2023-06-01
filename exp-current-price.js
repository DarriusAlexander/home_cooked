(function () {
  var obj = {};
  obj.locale = null;
  obj.internal = {};
  obj.getInfo = function (category) {
    if (category == "name") {
      return "Get Current Price of ETH";
    } else if (category == "description") {
      return "Get the current price of ETH and store it in variables.";
    } else if (category == "author") {
      return "Joe";
    } else if (category == "help") {
      return "v1.00 2019.12.8";
    } else if (category == "parameter") {
      return [];
    } else if (category == "internal") {
      return obj.internal;
    } else if (category == "actionCommand") {
      return [{
        id: 1,
        name: "Get Current Price of ETH",
        description: "Get the current price of ETH and store it in variables.",
        parameter: [{
          id: 1,
          name: "ObjectID:",
          type: "SwitchVariableObjectId",
          option: ["SelfObject"],
          defaultValue: -1
        }, {
          id: 200,
          name: "",
          type: "",
          defaultValue: -1
        }, {
          id: 201,
          name: "Price:",
          type: "VariableId",
          referenceId: 1,
          defaultValue: -1
        }]
      }];
    } else if (category == "linkCondition") {
      return [];
    }
    return null;
  };

  obj.initialize = function (settings) {};
  obj.finalize = function () {};
  obj.setLocale = function (_locale) {
    obj.locale = _locale;
  };
  obj.setInternal = function (settings) {};
  obj.update = function (dt) {};
  obj.call = function (name, param1, param2) {};
  obj.execActionCommand = function (index, valueJson, objectId, instanceId, actionId, commandId) {
    var EXEC_TYPE = "actionCommand";
    valueJson = obj.completeValueJson(index, valueJson, EXEC_TYPE);
    var paramId = obj.getInfo(EXEC_TYPE)[index].id;

    switch (paramId) {
      case 1:
        var objId = obj.getValueJson(valueJson, 1);
        var priceVar = obj.getVariable(objId, obj.getValueJson(valueJson, 201), instanceId);

        // Define a function to get the current price of ETH from the API
        function getEthPrice() {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", "https://express-api-starter-delta.vercel.app/eth/price");
          xhr.onload = function () {
            if (xhr.status === 200) {
              var data = JSON.parse(xhr.responseText);
              var ethPrice = data.ethPrice;
              priceVar.setValue(ethPrice);
            } else {
              console.error("Error: " + xhr.status);
            }
          };
          xhr.onerror = function () {
            console.error("Request failed");
          };
          xhr.send();
        }

        // Call the function to get the current price of ETH
        getEthPrice();

        // Set an interval to call the function every 5 seconds
        setInterval(getEthPrice, 5000);

        break;
    }

    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
  };

  obj.execLinkCondition = function (index, valueJson, objectId, instanceId, actionLinkId) {};

  obj.getVariable = function (objectId, variableId, instanceId) {
    if (objectId == 0) {
      return Agtk.variables.get(variableId);
    } else if (objectId == -2) {
      var selfObj = Agtk.objectInstances.get(instanceId);
      return selfObj.variables.get(variableId);
    } else if (objectId != -1) {
      var refObj = Agtk.objects.get(objectId);
      var refInsId = Agtk.objectInstances.getIdByName(objectId, refObj.name);
      var refIns = Agtk.objectInstances.get(refInsId);
      return refIns.variables.get(variableId);
    } else {
      return null;
    }
  };

  obj.completeValueJson = function (index, valueJson, type) {
    var vj = obj.getInfo(type)[index];
    var parameter = vj.parameter;
    if (!!parameter) {
      for (var i = 0; i < parameter.length; i++) {
        var id = parameter[i].id;
        var found = false;
        for (var j = 0; j < valueJson.length; j++) {
          if (valueJson[j].id == id) {
            found = true;
            break;
          }
        }
        if (!found) {
          valueJson.push({
            id: id,
            value: parameter[i].defaultValue
          });
        }
      }
    }
    return valueJson;
  };

  obj.getValueJson = function (valueJson, id) {
    for (var i = 0; i < valueJson.length; i++) {
      if (valueJson[i].id == id) {
        return valueJson[i].value;
      }
    }
    return null;
  };

  return obj;
})();
