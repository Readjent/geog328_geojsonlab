mapboxgl.accessToken = 'pk.eyJ1IjoicmVhZGplbnQiLCJhIjoiY2xvdGFjZ3Q2MDBqNTJpbzNiZG1iMmtqbCJ9.I-tbqvhpEhk4vuYF4KNMDw'

let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    zoom: 10.25, // starting zoom
    center: [114.16, 22.33] // starting center
});

async function geojsonFetch() {
    let response, tram, ferry, table;
    response = await fetch('assets/JSON_TRAM.json');
    tram = await response.json();
    response = await fetch('assets/JSON_FERRY.json');
    ferry = await response.json();

    //load data to the map as new layers and table on the side.
    map.on('load', function loadingData() {

        map.addSource('tram', {
            type: 'geojson',
            data: tram
        });

        map.addLayer({
            'id': 'tram-layer',
            'type': 'circle',
            'source': 'tram',
            'paint': {
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-color': 'red',
                'circle-stroke-color': 'white'
            }
        });


        map.addSource('ferry', {
            type: 'geojson',
            data: ferry
        });

        map.addLayer({
            'id': 'ferry-layer',
            'type': 'circle',
            'source': 'ferry',
            'paint': {
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-color': 'blue',
                'circle-stroke-color': 'white'
            }
        });

    });

    table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3, cell4, cell5, cell6;
    for (let i = 0; i < tram.features.length; i++) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);
        cell5 = row.insertCell(4);
        cell6 = row.insertCell(5);
        cell1.innerHTML = "tram";
        cell2.innerHTML = tram.features[i].properties.routeId;
        cell3.innerHTML = tram.features[i].properties.routeNameE;
        cell4.innerHTML = tram.features[i].properties.stopId;
        cell5.innerHTML = tram.features[i].properties.stopNameE;
        cell6.innerHTML = tram.features[i].properties.journeyTime;
    }

    for (let i = 0; i < ferry.features.length; i++) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);
        cell5 = row.insertCell(4);
        cell6 = row.insertCell(5);
        cell1.innerHTML = "ferry";
        cell2.innerHTML = ferry.features[i].properties.routeId;
        cell3.innerHTML = ferry.features[i].properties.routeNameE;
        cell4.innerHTML = ferry.features[i].properties.stopId;
        cell5.innerHTML = ferry.features[i].properties.stopNameE;
        cell6.innerHTML = tram.features[i].properties.journeyTime;
    }

    let btn = document.getElementsByTagName("button")[0];

    btn.addEventListener('click', sortTable);
};

geojsonFetch();

// define the function to sort table
function sortTable(e) {
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName('tbody')[0];
    //convert to arr for sorting
    let arr = Array.from(table.rows);

    //preserve top row so it doesn't get sorted
    let toprow = arr[0];
    arr.shift();
    arr = quickSort(arr);
    arr.unshift(toprow);

    while (tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
    arr.forEach(row => tbody.appendChild(row));
}

//don't wanna wait for the page to sort through the tons of items in my json so i made a quicksort implementation :P
const quickSort = (arr) => {
    if (arr.length <= 1) {
      return arr;
    }
  
    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];
  
    for (let i = 1; i < arr.length; i++) {
        x = arr[i].getElementsByTagName("td")[5].innerHTML;
        y = pivot.getElementsByTagName("td")[5].innerHTML;
      if (x < y) {
        leftArr.push(arr[i]);
      } else {
        rightArr.push(arr[i]);
      }
    }
  
    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
  };
