var mqtt = require('mqtt');
var msgCount = 0;

// connect to public test.moquitto.org broker
var client = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-tester"});

// receive incoming messages
client.on('message', function(topic, message) {
    // console.log("message is: " + message);
    // console.log("topic is: " + topic);
});

// on_connect
client.on('connect', function() {
    // console.log("Is connected ? " + client.connected);
});

// on_error
client.on('error', function(error) {
    // console.log("Unable to connect: " + error);
    process.exit(1);
});

// publish messages
function publish(topic, message) {
    // console.log("publishing: ", message);

    if (client.connected == true) {
        // console.log("publishing topic: " + topic + ", message: " + message);
        client.publish(topic, message);
    }

    // msgCount += 1;
    // if (msgCount > 2) {
    //     console.log("message count = 2, end script");
    //     clearTimeout(timer_id);
    //     client.end();
    //     process.exit(0);
    // }
}

var timerId;
var topic="test topic";
var message="test message";
var message_list = ["message1", "message2", "message3"];
var topic_list = ["topic1", "topic2", "topic3"];
// console.log("subscribing to topics...");
client.subscribe(topic);
client.subscribe(topic_list);
topic_list.forEach((element, index) => {
    timer_id = setInterval(function() {publish(element, message_list[index]);}, 1000);
});
timerId = setInterval(function() {publish(topic, message);}, 1000);
// console.log("end of script");