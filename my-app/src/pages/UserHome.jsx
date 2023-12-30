import React, { useState } from 'react';
import image from '/Users/mp/USTH/Study/Riceheo/my-app/src/map.png'
import './UserHome.css'; // Import the CSS file for styling
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"


const UserHome = () => {
    const bounds = [[-90, -180], [90, 180]];

    const position = [30, 40]

    return (
        <MapContainer center={[10,10]} zoom={3} scrollWheelZoom={false}>
            <ImageOverlay
                url={image}
                bounds={bounds}
            />

            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default UserHome;
