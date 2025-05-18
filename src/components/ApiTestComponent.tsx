import { useState, useEffect } from "react";
import axios from "axios";

function ApiTestComponent() {
  const [apiStatus, setApiStatus] = useState("Checking API connection...");
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        // First, try with our configured client
        console.log(
          "Testing API connection to http://192.168.50.6:8000/api/logs/"
        );
        setApiStatus("Making request to API...");

        const response = await axios.get("http://192.168.50.6:8000/api/logs/", {
          timeout: 10000,
        });

        console.log("API responded with:", response);
        setApiStatus("API connection successful! Check details below.");
        setApiData(response.data);
      } catch (error) {
        console.error("API Test failed:", error);

        if (error.response) {
          // The server responded with an error status
          setApiStatus(
            `API responded with error: ${error.response.status} ${error.response.statusText}`
          );
          setApiData(error.response.data);
        } else if (error.request) {
          // No response received
          setApiStatus(
            "No response received from API. Possible network issue or server is down."
          );
        } else {
          // Request setup error
          setApiStatus(`Error setting up request: ${error.message}`);
        }
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>

      <div className="mb-4">
        <div className="font-semibold">Status:</div>
        <div
          className={`mt-1 p-3 rounded ${
            apiStatus.includes("successful")
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {apiStatus}
        </div>
      </div>

      {apiData && (
        <div>
          <div className="font-semibold mb-2">API Response Data:</div>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-96">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
        <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Make sure the API server at <code>http://192.168.50.6:8000</code> is
            running
          </li>
          <li>
            Verify network connectivity between your machine and the API server
          </li>
          <li>Check if CORS is properly configured on the API server</li>
          <li>Ensure the correct API endpoint exists (/api/logs/)</li>
          <li>
            Check if any network security (firewalls, etc.) might be blocking
            the connection
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ApiTestComponent;
