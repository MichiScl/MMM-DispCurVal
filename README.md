MMM-DispCurVal
A MagicMirror² module for displaying current values from a JSON data source with labels and units. This module is ideal for showing real-time sensor data such as temperature, humidity, or other numerical values.

Features
Fetches data from a local JSON file or an external URL.

Displays a main title, a label for each value, the value itself, and a unit.

Supports multiple value displays within a single module instance.

Lightweight and simple to configure.

Installation
Navigate to your MagicMirror's modules folder.

cd ~/MagicMirror/modules


Clone this repository.

git clone [https://github.com/yourusername/MMM-DispCurVal](https://github.com/yourusername/MMM-DispCurVal)


Install dependencies.

cd MMM-DispCurVal
npm install


Configuration
Add the module to the config/config.js file of your MagicMirror.

| Option | Description | Type | Default |
| module | The name of the module. | string | "MMM-DispCurVal" |
| position | The position on the screen. See MagicMirror's documentation for all available positions. | string | "bottom_left" |
| config | The configuration object. | object | {} |
| config.canvasId | A unique ID for the module instance. Required for multiple instances of this module. | string | "canvas1" |
| config.dataFileUrl | The URL to your JSON data source (e.g., http://...) or the path to a local file (e.g., /home/pi/...). | string | undefined |
| config.updateInterval | The interval in milliseconds to fetch new data. | number | 600000 (10 minutes) |
| config.canvasWidth | The width of the module container. | number | 500 |
| config.canvasHeight | The height of the module container. | number | 180 |
| config.canvasTitle | The main title displayed at the top of the module. | string | "Current Values" |
| config.timestampDataID | The key in your JSON data to use as a timestamp. If this is empty, the module will use the last entry in the data array. | string | "" |
| config.timestampFormat | The format of the timestamp in your JSON data (e.g., DD.MM.YYYYTHH:MM:SS). Only used if timestampDataID is configured. | string | "DD.MM.YYYYTHH:MM:SS" |
| config.canvasConfig | An array of objects, where each object defines a new value to be displayed. | array | [] |
| config.canvasConfig[i].canvasTitle | The label for the value. | string | "" |
| config.canvasConfig[i].valueDataID | The key in your JSON data that holds the value to be displayed. | string | "" |
| config.canvasConfig[i].valueUnit | The unit to be displayed after the value. | string | "" |

Example config.js Entry
{
    "module": "MMM-DispCurVal",
    "position": "bottom_left",
    "config": {
        "canvasId": "canvas1",
        "dataFileUrl": "[http://192.168.178.59/sensordata/dht_sensor_data.json](http://192.168.178.59/sensordata/dht_sensor_data.json)",
        "updateInterval": 600000,
        "canvasWidth": 500,
        "canvasHeight": 180,
        "canvasTitle": "Current Values",
        "timestampDataID": "timestamp_sensor",
        "timestampFormat": "DD.MM.YYYYTHH:MM:SS",
        "canvasConfig": [
            {
                "canvasTitle": "Temperature inside",
                "valueDataID": "temp_innen",
                "valueUnit": "°C"
            },
            {
                "canvasTitle": "Humidity inside",
                "valueDataID": "hum_innen",
                "valueUnit": "%"
            }
        ]
    }
},