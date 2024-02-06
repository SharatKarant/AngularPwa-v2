// importScripts('ngsw-worker.js');

// let mainAppData;

// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'GET_LOCAL_STORAGE_DATA') {
//     mainAppData = event.data.data;
//   }
// });

// self.addEventListener('sync', (event) => {
//   console.log(event, mainAppData);
//   if (event.tag === 'myFirstBackgroundSync') {
//     const obj = mainAppData;
//     console.log('Data received in service worker:', obj);
//     event.waitUntil(addData(obj));
//   }
// });

// async function addData(obj) {
//   console.log(obj);
//   try {
//     const response = await fetch('http://localhost:4000/post-data', {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(obj)
//     });

//     if (response.ok) {
//       console.log('Data added successfully');
//     } else {
//       console.error('Error adding data:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error adding data:', error);
//   }
// }

importScripts('ngsw-worker.js');

let db;


self.addEventListener('sync', (event) => {
  if (event.tag === 'myFirstBackgroundSync') {
    event.waitUntil(getDataAndSend('http://localhost:4000/post-data'));
  }
  if (event.tag === 'events-backgroundsync') {
    event.waitUntil(getDataAndSend('http://localhost:3000/event'));
  }
});


async function addData(idbobj, url) {
  let obj = idbobj;
  console.log(obj);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    });

    if (response.ok) {
      console.log('Data added successfully');
      deleteData();
    } else {
      console.error('Error adding data:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding data:', error);
  }
}

function getDataAndSend(url) {
  const request = indexedDB.open('my-db');
  request.onerror = (event) => {
    console.log('Please allow my web app to use IndexedDB', event);
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    getData(db,url);
  };
}

function getData(db,url) {
  const transaction = db.transaction(['user-store']);
  const objectStore = transaction.objectStore('user-store');
  const request = objectStore.get('obj');
  request.onerror = (event) => {
    console.error("Error while  retrieving data", event);
  };
  request.onsuccess = (event) => {
    addData(request.result,url);
    console.log('The data stored ' + request.result);
  };
}

function deleteData() {
  const transaction = db.transaction(['user-store'], 'readwrite');
  const objectStore = transaction.objectStore('user-store');
  const request = objectStore.delete('obj');
  request.onerror = (event) => {
    console.error("Error while deleting data", event);
  };
  request.onsuccess = (event) => {
    console.log("Data deleted successfully");
  };
}