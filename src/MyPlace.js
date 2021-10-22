import {Map} from "./UI/Map";

class MyPlace {
    constructor(coordinates, address) {
        new Map(coordinates);
        const placeAddress = document.querySelector('header h1');
        placeAddress.textContent = address;
    }
}

const url = new URL(location.href);
const queryParam = url.searchParams;
const coords = {
    lat: parseFloat( queryParam.get('lat')),
    lng: parseFloat(queryParam.get('lng'))
}
const address = queryParam.get('address');

new MyPlace(coords, address);