var heater = require("heater");

heater.start({
	id: "floor_bath",
	title: "Floor Bath",
  temperature: 	{ device: "wb-m1w2_33",  control: "External Sensor 1" },
  valve:	 			{ device: "wb-gpio", control: "EXT2_ON1" }
});

heater.start({
	id: "floor_kitchen",
	title: "Floor Kitchen",
  temperature: 	{ device: "wb-m1w2_33", control: "External Sensor 2" },
  valve: 				{ device: "wb-gpio", control: "EXT2_ON2" }
});

heater.start({
	id: "floor_cabinet",
	title: "Floor Cabinet",
  temperature: 	{ device: "wb-m1w2_52",  control: "External Sensor 1" },
  valve:	 			{ device: "wb-gpio", control: "EXT2_ON3" }
});

heater.start({
	id: "floor_living",
	title: "Floor Living",
  temperature: 	{ device: "wb-m1w2_52", control: "External Sensor 2" },
  valve: 				{ device: "wb-gpio", control: "EXT2_ON4" }
});
