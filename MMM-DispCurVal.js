/* MMM-DispCurVal.js
 * MagicMirror Module
 * This module fetches JSON data and displays the current values
 * with labels and units.
 */
Module.register("MMM-DispCurVal", {
    // Default module configuration.
    defaults: {
        updateInterval: 600000, // Update every 10 minutes
        dataFileUrl: undefined,
        canvasId: "canvas1",
        canvasWidth: 500,
        canvasHeight: 180,
        canvasTitle: "Current Values",
        timestampDataID: "",
        timestampFormat: "DD.MM.YYYYTHH:MM:SS",
        canvasConfig: []
    },

    // Define start method.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.currentValues = {};
        this.loaded = false;
        this.scheduleUpdate();
    },

    // Schedule the next update.
    scheduleUpdate: function() {
        var self = this;
        this.updateIntervalId = setInterval(function() {
            self.sendSocketNotification("FETCH_DATA", {
                url: self.config.dataFileUrl,
                canvasId: self.config.canvasId
            });
        }, this.config.updateInterval);

        // Fetch data immediately on start.
        this.sendSocketNotification("FETCH_DATA", {
            url: this.config.dataFileUrl,
            canvasId: this.config.canvasId
        });
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "mmm-dispcurval-wrapper";
        
        // Add a card-like container
        var card = document.createElement("div");
        card.className = "mmm-dispcurval-card";

        // Add the main title
        var mainTitle = document.createElement("div");
        mainTitle.className = "mmm-dispcurval-main-title";
        mainTitle.innerHTML = this.config.canvasTitle;
        card.appendChild(mainTitle);

        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            wrapper.className = "dimmed light";
            return wrapper;
        }
        
        if (Object.keys(this.currentValues).length === 0) {
            wrapper.innerHTML = "No data available";
            wrapper.className = "dimmed light";
            return wrapper;
        }

        // Create the container for the values
        var valuesContainer = document.createElement("div");
        valuesContainer.className = "mmm-dispcurval-values-container";

        this.config.canvasConfig.forEach(cfg => {
            const valueId = cfg.valueDataID;
            const valueLabel = cfg.canvasTitle;
            const valueUnit = cfg.valueUnit || "";
            const value = this.currentValues[valueId];

            if (value !== undefined) {
                var valueLine = document.createElement("div");
                valueLine.className = "mmm-dispcurval-value-line";

                var titleSpan = document.createElement("span");
                titleSpan.className = "mmm-dispcurval-title";
                titleSpan.innerHTML = valueLabel;

                var valueSpan = document.createElement("span");
                valueSpan.className = "mmm-dispcurval-value";
                valueSpan.innerHTML = value;

                var unitSpan = document.createElement("span");
                unitSpan.className = "mmm-dispcurval-unit";
                unitSpan.innerHTML = valueUnit;

                valueLine.appendChild(titleSpan);
                valueLine.appendChild(valueSpan);
                valueLine.appendChild(unitSpan);
                valuesContainer.appendChild(valueLine);
            }
        });

        card.appendChild(valuesContainer);
        wrapper.appendChild(card);
        
        return wrapper;
    },

    // Define required scripts.
    getStyles: function() {
        return ["MMM-DispCurVal.css"];
    },

    // Handle notifications from node_helper.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "DATA_FETCHED") {
            if (payload.canvasId === this.config.canvasId) {
                if (payload.success) {
                    this.processData(payload.data);
                    this.loaded = true;
                } else {
                    Log.error("Data fetch failed:", payload.error);
                    this.currentValues = {};
                    this.loaded = true;
                }
                this.updateDom(1000);
            }
        }
    },
    
    // Process the fetched data to extract the current values.
    processData: function(data) {
        let latestDataPoint = null;
        if (this.config.timestampDataID && this.config.timestampDataID !== "") {
            // Find the latest data point based on timestamp
            let latestTimestamp = -Infinity;
            data.forEach(item => {
                const timestamp = moment(item[this.config.timestampDataID], this.config.timestampFormat);
                if (timestamp.isValid() && timestamp.valueOf() > latestTimestamp) {
                    latestTimestamp = timestamp.valueOf();
                    latestDataPoint = item;
                }
            });
        } else {
            // Use the last entry in the array
            latestDataPoint = data[data.length - 1];
        }

        if (latestDataPoint) {
            const newValues = {};
            this.config.canvasConfig.forEach(cfg => {
                if (cfg.valueDataID && cfg.valueDataID !== "") {
                    newValues[cfg.valueDataID] = latestDataPoint[cfg.valueDataID];
                }
            });
            this.currentValues = newValues;
        } else {
            this.currentValues = {};
        }
    }
});
