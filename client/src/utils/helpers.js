export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

/**
 * Opens the database connection, 
 * 
 * Creates the object store (if it's the first time using it on the machine)
 * 
 * Runs whatever transaction function we need to have run on
 * a successful connection
 * @param {String} storeName a string to match against to choose which object store to select 
 * @param {String} method a string to match against to determine what to do with the store
 * @param {{properties: *}} object object to manipulate into or out of the object store
 * @returns Promise
 */
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {

    const request = window.indexedDB.open('shop-shop', 1);
    let db, tx, store;

    request.onupgradeneeded = function(event) {
      const db = request.result;
      db.createObjectStore('products', { keyPath: '_id'} );
      db.createObjectStore('categories', { keyPath: '_id'} );
      db.createObjectStore('cart', { keyPath: '_id'} );
    };

    request.onerror = function(event) {
      console.log('There was an error.');
    };

    request.onsuccess = function(event) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);
      db.onerror = function(error) {
        console.log('there was an error on success method: ', error);
      };

      switch(method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid Method!');
          break;
      }
      //when transaction done close the connection
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}

 /**
* 
* @param {Number} num number that needs commas placed in the string
* @returns string
*/
export function numberWithCommas(num) {
 let parts = num.toString().split(".");
 parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

 if (parts.length === 2) {
   parts.splice(1, 0, parts[1] + "0");
   parts.splice(2);
   if (parts[1].length > 2) {
     let decimals = parts.pop().split('');

     decimals.splice(2);

     let joinedDec = decimals.join('');

     parts.push(joinedDec);
   }
 }
 return parts.join('.');
}
