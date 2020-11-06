// TODO: add gist range

var MODULE_NAME 		= "heater";
var MODULE_VERSION  = "1.7.0";

exports.start = function(config) {
  if (!validateConfig(config)) return;

  //  device  //
	createDevice(config);

  //  rules  //
  createRule_temperature(config.id,
    config.temperature.device,
    config.temperature.control);
  createRule_range_target(config.id);
  createRule_switch_valve(config.id,
    config.valve.device,
    config.valve.control,
    (config.valve.activationValue === undefined || config.valve.activationValue === null) ? true : config.valve.activationValue
  );

  log(config.id + ": Started (" + MODULE_NAME + " ver. " + MODULE_VERSION + ")");
};

//  Validate config  //

var validateConfig = function(_config) {
  if (!_config) {
    log("Error: " + MODULE_NAME + ": No config");
    return false;
  }

  if (!_config.id || !_config.id.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad id");
    return false;
  }

  if (!_config.title || !_config.title.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad title");
    return false;
  }

  if (!_config.temperature
    || !_config.temperature.device
    || !_config.temperature.control) {
    log("Error: " + MODULE_NAME + ": Config: Bad temperature");
    return false;
  }

  if (!_config.valve
    || !_config.valve.device
    || !_config.valve.control) {
    log("Error: " + MODULE_NAME + ": Config: Bad valve");
    return false;
  }

  return true;
}

//
//  Device  //
//

function createDevice(config) {
  var valve_value = dev[config.valve.device][config.valve.control];

	var cells = {
		enabled:      { type: "switch", value: true, readonly: false  },
    temperature:  { type: "temperature",  value: 0 },
    valve:       { type: "switch", value: valve_value, forceDefault: true, readonly: false },
    target:       { type: "range",  max: 35, value: 0, readonly: false  }
	}

	defineVirtualDevice(config.id, {
	  title: config.title,
	  cells: cells
	});
}

//
//  Rules  //
//

//  sensor -> temperature  //

function createRule_temperature(device_id, device, control) {
  defineRule({
    whenChanged: device + "/" + control,
    then: function (newValue, devName, cellName) {
      if (dev[device_id]["temperature"] === newValue) return;
      dev[device_id]["temperature"] = newValue;

      if (dev[device_id]["enabled"]) {
        temperature_check(device_id);
      }
    }.bind(this)
  });
}

//  Range: target  //

function createRule_range_target(device_id) {
  defineRule({
    whenChanged: device_id + "/target",
    then: function (newValue, devName, cellName) {
      log(device_id + ": New target: " + newValue);
      if (dev[device_id]["enabled"]) {
        temperature_check(device_id);
      }
    }.bind(this)
  });
}

//  Switch: valve   //

function createRule_switch_valve(device_id, device, control, activationValue) {
  defineRule({
    whenChanged: device_id + "/valve",
    then: function (newValue, devName, cellName) {
      var hwValue = (newValue) ? activationValue : !activationValue;
      if (dev[device][control] !== hwValue) dev[device][control] = hwValue;
    }
  });

  defineRule({
    whenChanged: device + "/" + control,
    then: function (newValue, devName, cellName) {
      var hwValue = (newValue === activationValue) ? true : false;
      if (dev[device_id]["valve"] !== hwValue) dev[device_id]["valve"] = hwValue;
    }
  });
}

function temperature_check(device_id) {
  //  open valve to increase temperature  //

	if (dev[device_id]["temperature"] >= dev[device_id]["target"] + 3) {
    dev[device_id]["valve"] = false;
  }

	else if (dev[device_id]["temperature"] <= dev[device_id]["target"] - 3) {
    dev[device_id]["valve"] = true;
  }
}
