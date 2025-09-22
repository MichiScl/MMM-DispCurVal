/* node_helper.js
 * MagicMirror Module
 * This helper fetches JSON data from the specified URL.
 */
const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const fs = require('fs').promises;
const path = require('path');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node_helper for " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FETCH_DATA") {
            this.fetchData(payload);
        }
    },

    fetchData: async function(payload) {
        const { url, canvasId } = payload;
        let data;

        try {
            if (url.startsWith("http://") || url.startsWith("https://")) {
                console.log(`MMM-DispCurVal NodeHelper (${canvasId}): Fetching data from URL: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                data = await response.json();
            } else {
                console.log(`MMM-DispCurVal NodeHelper (${canvasId}): Reading data from local file: ${url}`);
                // Construct absolute path
                const absolutePath = path.resolve(this.path, "..", url);
                const fileContent = await fs.readFile(absolutePath, 'utf8');
                data = JSON.parse(fileContent);
            }

            console.log(`MMM-DispCurVal NodeHelper (${canvasId}): Data fetched successfully.`);
            this.sendSocketNotification("DATA_FETCHED", { success: true, data: data, canvasId: canvasId });
        } catch (error) {
            console.error(`MMM-DispCurVal NodeHelper (${canvasId}): Error fetching/reading/processing data:`, error);
            this.sendSocketNotification("DATA_FETCHED", { success: false, error: error.message, canvasId: canvasId });
        }
    }
});
