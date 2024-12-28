import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view'; // Import the library

function App() {
  const [apiDocs, setApiDocs] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api-docs') // Correct endpoint here
      .then(response => setApiDocs(response.data))
      .catch(error => console.error('Error fetching API docs:', error));
  }, []);

  return (
    <div>
      <h1>API Documentation Generator</h1>
      {apiDocs ? (
        <ReactJson src={apiDocs} theme="monokai" /> // Use ReactJson here
      ) : (
        <p>Loading API documentation...</p>
      )}
    </div>
  );
}

export default App;

