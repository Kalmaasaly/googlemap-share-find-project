import {Modal} from './UI/Modal'
import {Map} from "./UI/Map";
import {getAddressFromCoordinate, getCoordsFromAddress} from "./Utility/Location";

class PlaceFinder {

    constructor() {
        const addressForm = document.querySelector("form");
        const locateUserBtn = document.getElementById("locate-btn");
        this.shareBtn = document.getElementById('share-btn');
        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        this.shareBtn.addEventListener('click', this.sharePlaceHandler)
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }
        this.shareBtn.disabled = false;
        const sharedInputElement = document.getElementById("share-link");
        sharedInputElement.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`
    }

    sharePlaceHandler() {
        const sharedInputElement = document.getElementById("share-link");
        if (!navigator.clipboard) {
            sharedInputElement.select();
            return;
        }
        navigator.clipboard.writeText(sharedInputElement.value)
            .then(() => {
                alert('Copied into clipboard');
                console.log('copied')
            }).catch(err => {
            sharedInputElement.select();
            console.log(err)
        });
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert("Location feature doesn't support by this browser");
            return;
        }
        const modal = new Modal('loading-modal-content',
            'Loading location please wait');
        modal.show();
        navigator.geolocation
            .getCurrentPosition(async success => {
                    // console.log(success);
                    const coordinates = {
                        lat: success.coords.latitude,
                        lng: success.coords.longitude
                    };
                    //console.log(coordinates);
                    const address = await getAddressFromCoordinate(coordinates);
                    modal.hide();
                    this.selectPlace(coordinates, address);
                },
                error => {
                    modal.hide();
                    alert("couldn't locate you unfortunately. Please enter the address manually");
                });
    }

    async findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;
        if (!address || address.trim().length === 0) {
            alert('Invalid address entered - please try again!');
            return;
        }
        const modal = new Modal(
            'loading-modal-content',
            'Loading location - please wait!'
        );
        modal.show();
        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates, address);
        } catch (err) {
            alert(err.message);
        }
        modal.hide();
    }
}

new PlaceFinder();