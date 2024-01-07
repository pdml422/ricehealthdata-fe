import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {Button, Form, Input, Modal} from "antd";

const UserHome = () => {
    const [data, setData] = useState([]);
    const [image, setImage] = useState('');
    const [markers, setMarkers] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isAddRGBModalOpen, setIsAddRGBModalOpen] = useState(false);
    const [selectedRGB, setSelectedRGB] = useState(null);

    const [newRed, setNewRed] = useState('');
    const [newGreen, setNewGreen] = useState('');
    const [newBlue, setNewBlue] = useState('');
    const [newId, setNewId] = useState('');

    const addRGBButtonStyle = {
        textAlign: 'right',
        marginBottom: '16px', // Adjust the margin as needed
    };

    const showAddRGBModal = () => {
        setIsAddRGBModalOpen(true);
    }

    const handleAddRGBOk = async () => {
        setIsAddRGBModalOpen(false);
        const newData = {
            id: newId,
            red: newRed,
            green: newGreen,
            blue: newBlue

        };
        await fetchImage(newData);
        await fetchMarkers();
    };

    const handleCancel = () => {
        setIsAddRGBModalOpen(false);
        setSelectedRGB(null);
    };



    const fetchImage = async (values) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.post('http://100.96.184.148:8080/image/rgb', values, config);
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

    const fetchData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.get('http://100.96.184.148:8080/statistical/searchAll', config);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
        fetchData();
    }, []);

    const scaledWidth = 8029 / 4.75;
    const scaledHeight = 8609 / 4.75;

    return (
        <>
            <div style={addRGBButtonStyle}>
                <Button onClick={() => showAddRGBModal()} type="primary">Get RGB</Button>
            </div>


            <div style={{position: 'relative'}}>
                <img src={image} alt="Map" width={scaledWidth} height={scaledHeight} />

                {/* Markers */}
                {markers.map((marker, index) => {
                    const { x, y, dataId, } = marker;

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
                {popupOpen && selectedMarker &&  (
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
                        <p>{selectedMarker.id} </p>
                    </div>
                )}
            </div>

            <Modal
                title="Add RGB"
                visible={isAddRGBModalOpen}
                onOk={handleAddRGBOk}
                onCancel={handleCancel}
            >
                <Form >
                    <Form.Item label="ID" name="id">
                        <Input
                            value={newId} onChange={(e) => setNewId(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Red" name="red">
                        <Input
                            value={newRed} onChange={(e) => setNewRed(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Green" name="green">
                        <Input
                            value={newGreen} onChange={(e) => setNewGreen(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Blue" name="blue">
                        <Input
                            value={newBlue} onChange={(e) => setNewBlue(e.target.value)}
                        />
                    </Form.Item>
                        </Form >
            </Modal>
        </>
    );
};

export default UserHome;