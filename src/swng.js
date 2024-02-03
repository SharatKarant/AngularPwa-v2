importScripts('ngsw-worker.js');

let mainAppData;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_LOCAL_STORAGE_DATA') {
    mainAppData = event.data.data;
  }
});

self.addEventListener('sync', (event) => {
  console.log(event, mainAppData);
  if (event.tag === 'myFirstBackgroundSync') {
    const obj = mainAppData;
    console.log('Data received in service worker:', obj);
    event.waitUntil(addData(obj));
  }
});

async function addData(obj) {
  console.log(obj);
  try {
    const response = await fetch('http://localhost:4000/post-data', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    });

    if (response.ok) {
      console.log('Data added successfully');
    } else {
      console.error('Error adding data:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding data:', error);
  }
}