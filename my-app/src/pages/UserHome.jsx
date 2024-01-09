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

    const fetchIdImage = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get(`http://100.96.184.148:8080/image/rgb/${localStorage.getItem('userId')}`, config);
            console.log(response.data[0].id)
            setNewId(response.data[0].id)
            localStorage.setItem('id', newId)
        } catch (error) {
            console.error('Error fetching image id:', error);
        }
    }

    fetchIdImage()

    const defaultRed = localStorage.getItem('red') || 40;
    const defaultGreen = localStorage.getItem('green') || 30;
    const defaultBlue = localStorage.getItem('blue') || 20;
    const defaultId = localStorage.getItem('id');

    const [newRed, setNewRed] = useState(defaultRed);
    const [newGreen, setNewGreen] = useState(defaultGreen);
    const [newBlue, setNewBlue] = useState(defaultBlue);
    const [newId, setNewId] = useState(defaultId);



    const addedImageData = {
        red: localStorage.getItem('red') || newRed,
        green: localStorage.getItem('green') || newGreen,
        blue: localStorage.getItem('blue') || newBlue,
        id: localStorage.getItem('id') || newId,
    };

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
        localStorage.setItem('red', newRed)
        localStorage.setItem('green', newGreen)
        localStorage.setItem('blue', newBlue)
        localStorage.setItem('id', newId)
        await fetchMarkers();
    };

    const handleCancel = () => {
        setIsAddRGBModalOpen(false);
        setSelectedRGB(null);
    };

    const handleImageClick = function(e) {
        const ratioX = e.target.naturalWidth / scaledWidth;
        const ratioY = e.target.naturalHeight / scaledHeight;

        const domX = e.clientX - e.target.getBoundingClientRect().left;
        const domY = e.clientY  - e.target.getBoundingClientRect().top;

        const imgX = Math.floor(domX * ratioX);
        const imgY = Math.floor(domY * ratioY);

        console.log(imgX, imgY);
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
            const response = await axios.get(`http://100.96.184.148:8080/image/map/${localStorage.getItem('id')}`, config);
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

    const handleMarkerClick = async (markerData) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            axios.get(`http://100.96.184.148:8080/statistical/${markerData.id}`, configHeader)
                .then(response => {
                    console.log(response.data)
                    setData(response.data)
                })


            await fetchIdImage();
            setSelectedMarker(markerData);
            setPopupOpen(true);
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchData();
        fetchImage(addedImageData);
        fetchMarkers();

    }, []);

    const scaledWidth = 8029 / 3.42;
    const scaledHeight = 8609 / 3.42;

    return (
        <>
            <div style={addRGBButtonStyle}>
                <Button onClick={() => showAddRGBModal()} type="primary">Get RGB</Button>
            </div>


            <div style={{position: 'relative', display: 'flex'}}>
                <img onClick={handleImageClick} src={image} alt="Map" width={scaledWidth} height={scaledHeight} />

                {/* Markers */}
                {markers.map((marker, index) => {
                    const { x, y, dataId, } = marker;

                    const markerPosition = {
                        top: y / 3.42,
                        left: x / 3.42,
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
                            >
                            </div>
                        </div>
                    );
                })}

                {/* Custom Popup */}
                {popupOpen && selectedMarker &&  (
                    <div
                        style={{
                            position: 'absolute',
                            top: selectedMarker.y / 3.42 - 20,
                            left: selectedMarker.x / 3.42 + 20,
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        }}
                        onClick={togglePopup}
                    >
                        <p>
                            Replicate: {data.replicate} <br/>
                            SubReplicate: {data.subReplicate} <br/>
                            Date: {data.date} <br/>
                            Chlorophyll: {data.chlorophyll} <br/>
                            PConc: {data.PConc} <br/>
                            KConc: {data.KConc} <br/>
                            NConc: {data.NConc} <br/>
                            WetWeight: {data.wetWeight} <br/>
                            DriedWeight: {data.driedWeight} <br/>
                            Moiture: {data.moiture} <br/>
                            Digesion: {data.digesion} <br/>

                        </p>
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