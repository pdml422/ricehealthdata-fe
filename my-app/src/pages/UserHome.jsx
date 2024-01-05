import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'
import csvFile from '/Users/mp/USTH/Study/Riceheo/my-app/src/Data_pixel.csv'
import axios from "axios";
const UserHome = () => {

    const [image, setImage] = useState('');

    const fetchImage = async () => {
        try {
            const config = {
            };
            const dataToSend = {
                id: 1,
                red: 50,
                green: 40,
                blue: 30
            };

            const response = await axios.post('http://100.96.184.148:8080/image/rgb',dataToSend, config);
            setImage(response.data)
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchImage();
    }, );






    const scaledWidth = 8029 / 5.5;
    const scaledHeight = 8609 / 5.5;

    const [markers, setMarkers] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        // Fetch CSV file
        const csvFilePath = csvFile; // Replace with your actual CSV file path
        fetch(csvFilePath)
            .then((response) => response.text())
            .then((csv) => {
                // Parse CSV data and select only 'X_new' and 'Y_new' columns
                Papa.parse(csv, {
                    header: true,
                    dynamicTyping: true,
                    complete: (result) => {
                        const selectedColumns = result.data.map(({ Replicate, subReplicate, X_new, Y_new, Label }) => ({ Replicate, subReplicate, X_new, Y_new, Label }));
                        setMarkers(selectedColumns);
                    },
                });
            });
    }, []);

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
    };

    const handleMarkerClick = (markerData) => {
        setSelectedMarker(markerData);
        setPopupOpen(true);
    };

    return (
        <>
            <div style={{ position: 'relative' }}>
                <img src={image} alt="Map" width={scaledWidth} height={scaledHeight} />

                {/* Markers */}
                {markers.map((marker, index) => {
                    const { X_new, Y_new } = marker;

                    const markerPosition = {
                        top: Y_new / 5.5,
                        left: X_new / 5.5,
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
                            <div style={{ width: '10px', height: '10px', backgroundColor: 'red', borderRadius: '50%' }}></div>
                        </div>
                    );
                })}

                {/* Custom Popup */}
                {popupOpen && selectedMarker && (
                    <div
                        style={{
                            position: 'absolute',
                            top: selectedMarker.Y_new / 4.75 - 20,
                            left: selectedMarker.X_new / 4.75 + 20,
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        }}
                        onClick={togglePopup}
                    >
                        <p> {selectedMarker.Replicate} {selectedMarker.subReplicate}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserHome;
