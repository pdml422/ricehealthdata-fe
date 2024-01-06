import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserHome = () => {
    const [image, setImage] = useState('');
    const [markers, setMarkers] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const fetchImage = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };
            const dataToSend = {
                id: 1,
                red: 50,
                green: 40,
                blue: 30,
            };

            const response = await axios.post('http://100.96.184.148:8080/image/rgb', dataToSend, config);
            setImage(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchMarkers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            }
            }
            const response = await axios.get('http://100.96.184.148:8080/image/map/1', config);
            setMarkers(response.data);
        } catch (error) {
            console.error('Error fetching markers:', error);
        }
    };

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
    };

    const handleMarkerClick = (markerData) => {
        setSelectedMarker(markerData);
        setPopupOpen(true);
    };

    useEffect(() => {
        fetchImage();
        fetchMarkers();
    }, []);

    const scaledWidth = 8029 / 4.75;
    const scaledHeight = 8609 / 4.75;

    return (
        <>
            <div style={{ position: 'relative' }}>
                <img src={image} alt="Map" width={scaledWidth} height={scaledHeight} />

                {/* Markers */}
                {markers.map((marker, index) => {
                    const { x, y, dataId} = marker;

                    const markerPosition = {
                        top: y / 4.75,
                        left: x / 4.75,
                    };

                    return (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                top: markerPosition.top,
                                left: markerPosition.left,
                                transform: 'translate(-50%, -50%)',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleMarkerClick(marker)}
                        >
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: 'red',
                                    borderRadius: '50%',
                                }}
                            ></div>
                        </div>
                    );
                })}

                {/* Custom Popup */}
                {popupOpen && selectedMarker && (
                    <div
                        style={{
                            position: 'absolute',
                            top: selectedMarker.y / 4.75 - 20,
                            left: selectedMarker.x / 4.75 + 20,
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        }}
                        onClick={togglePopup}
                    >
                        <p>{selectedMarker.id}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserHome;