import React, { useState, useEffect } from 'react';
import type { MenuProps } from 'antd';
import axios from 'axios';
import { CloseOutlined } from '@ant-design/icons';
import {Button, Form, Input, Modal, notification, Dropdown} from "antd";

const UserAbout = () => {

    const divisionFactor = localStorage.getItem('id') === "1" ? 5.8 : 4.6;
    const [data, setData] = useState([]);
    const [image, setImage] = useState('');
    const [markers, setMarkers] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isAddRGBModalOpen, setIsAddRGBModalOpen] = useState(false);
    const [selectedRGB, setSelectedRGB] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    // const [newWidth, setNewWidth] = useState(localStorage.getItem('width') / divisionFactor);
    // const [newHeight, setNewHeight] = useState(localStorage.getItem('height') / divisionFactor);

    const [x, setX] = useState()
    const [y, setY] = useState()
    const [dataId, setDataId] = useState()

    const [newReplicate, setNewReplicate] = useState('');
    const [newSubReplicate, setNewSubReplicate] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newChlorophyll, setNewChlorophyll] = useState('');
    const [newLongitude, setNewLongitude] = useState('');
    const [newLatitude, setNewLatitude] = useState('');
    const [newMoiture, setNewMoiture] = useState('');
    const [newDigesion, setNewDigesion] = useState('');
    const [newPConc, setNewPConc] = useState('');
    const [newKConc, setNewKConc] = useState('');
    const [newNConc, setNewNConc] = useState('');
    const [newWetWeight, setNewWetWeight] = useState('');
    const [newDriedWeight, setNewDriedWeight] = useState('');

    const [toggleState, setToggleState] = useState(false);

    const handleToggle = () => {
        setToggleState(!toggleState);
    };


    const fetchIdImage = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get(`http://100.96.184.148:8080/image/hyper/${localStorage.getItem('userId')}/header`, config);
            setImageIdData(response.data);
        } catch (error) {
            console.error('Error fetching image id:', error);
        }
    }


    const defaultRed = localStorage.getItem('red') || 40;
    const defaultGreen = localStorage.getItem('green') || 30;
    const defaultBlue = localStorage.getItem('blue') || 20;
    const defaultId = localStorage.getItem('id');

    const [newRed, setNewRed] = useState(defaultRed);
    const [newGreen, setNewGreen] = useState(defaultGreen);
    const [newBlue, setNewBlue] = useState(defaultBlue);
    const [newId, setNewId] = useState(defaultId);


    const modalContentStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    };

    const ButtonStyle = {
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        justifyContent: 'flex-end',
    };

    const HeaderFilesStyle = {
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        textAlign: 'left',
    }


    const addedImageData = {
        red: localStorage.getItem('red') || newRed,
        green: localStorage.getItem('green') || newGreen,
        blue: localStorage.getItem('blue') || newBlue,
        id: localStorage.getItem('id') || newId,
    };

    const showAddModal = () => {
        setIsAddModalOpen(true);
    }
    const showAddRGBModal = () => {
        setIsAddRGBModalOpen(true);
    }

    const showModalConfirm = () => {
        setIsModalConfirmOpen(true);
    }

    const handleConfirmOk = () => {
        setIsModalConfirmOpen(false);
        addMapPoint(addedMapPoint);
    };

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
        setIsAddModalOpen(false);
        setIsModalConfirmOpen(false);
    };

    const handleAddOk = async () => {
        setIsAddModalOpen(false);
        const newData = {
            replicate: newReplicate,
            subReplicate: newSubReplicate,
            date: newDate,
            longitude: newLongitude,
            latitude: newLatitude,
            digesion: newDigesion,
            pConc: newPConc,
            kConc: newKConc,
            nConc: newNConc,
            moiture: newMoiture,
            wetWeight: newWetWeight,
            driedWeight: newDriedWeight,
            chlorophyll: newChlorophyll,
            // ... (use state variables for other properties)
            userId: localStorage.getItem('userId')
        };
        await createData(newData);
        showModalConfirm()
    };

    const addMapPoint = async (values) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                }
            }
            await axios.post(`http://100.96.184.148:8080/image/map/add`,values, config);
            window.location.reload();
            notification.success({
                message: 'Data created successfully',
            })
        } catch (error) {
            console.error('Error fetching markers:', error);
        }
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


    const fetchImageResolution = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };

            const response = await axios.get(`http://100.96.184.148:8080/image/resolution/${localStorage.getItem('id')}`, config);
            // setNewWidth(response.data.width);
            // setNewHeight(response.data.height);
            localStorage.setItem('width', response.data.width / divisionFactor);
            localStorage.setItem('height', response.data.height / divisionFactor);
            console.log(response.data.width, response.data.height)
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

    const createData = async (values) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            axios.post(`http://100.96.184.148:8080/statistical/create`, values, configHeader).then(response => {
                setDataId(response.data.id)
            })
        } catch (error) {
            console.error('Error creating data:', error);
        }
    };

    const addedMapPoint = {
        X: x,
        Y: y,
        imageId: localStorage.getItem('id'),
        dataId: dataId,
    }


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
            axios.get(`http://100.96.184.148:8080/statistical/${markerData.dataId}`, configHeader)
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
        fetchIdImage();
        fetchImageResolution();
    }, []);



    const [imageIdData, setImageIdData] = useState([]);

    const handleImageClick = function(e) {
        const ratioX = e.target.naturalWidth / localStorage.getItem('height');
        const ratioY = e.target.naturalHeight / localStorage.getItem('width');

        const domX = e.clientX - e.target.getBoundingClientRect().left;
        const domY = e.clientY  - e.target.getBoundingClientRect().top;

        const imgX = Math.floor(domX * ratioX);
        const imgY = Math.floor(domY * ratioY);

        console.log(imgX, imgY)

        setX(imgX)
        setY(imgY)
        if (toggleState) {
            showAddModal();
        }
    };

    const handleMenuItemClick = (id) => {
        localStorage.setItem('id', id);
        window.location.reload();
    };



    const items = imageIdData.map((item) => {
        const pathParts = item.path.split('/');
        const fileName = pathParts[pathParts.length - 1];

        return {
            key: item.id.toString(),
            label: (
                <div key={item.id} onClick={() => handleMenuItemClick(item.id)}>
                    {fileName}
                </div>
            ),
        };
    });

    return (
        <>
            <div style={ButtonStyle}>
                <div style={HeaderFilesStyle}>
                    <Dropdown menu={{items}} placement="bottom" arrow>
                        <Button type="primary">Header Files</Button>
                    </Dropdown>
                </div>
                <div style={{marginLeft: 'auto'}}>
                    <div style={ButtonStyle}>
                    <Button type={toggleState ? 'primary' : 'default'} onClick={handleToggle}>
                        {toggleState ? 'Edit Mode: On' : 'Edit Mode: Off'}
                    </Button>
                    <Button onClick={() => showAddRGBModal()} type="primary">Get RGB</Button>
                    </div>
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{position: 'relative'}}>
                    {/* Image */}
                    <img onClick={handleImageClick} src={image} alt="Map" width={localStorage.getItem('height')}
                         height={localStorage.getItem('width')}/>

                    {/* Red dots */}
                    {markers.map((marker, index) => {
                        const {x, y} = marker;

                        const markerPosition = {
                            top: y / divisionFactor,
                            left: x / divisionFactor,
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
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                    }}
                                >
                                </div>
                            </div>
                        );
                    })}

                    {/* Custom Popup */}
                    {popupOpen && selectedMarker && (
                        <div
                            style={{
                                position: 'absolute',
                                top: selectedMarker.y / divisionFactor - 20,
                                left: selectedMarker.x / divisionFactor + 20,
                                backgroundColor: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                                zIndex: 1000,
                            }}
                        >
                            <Button
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    padding: 1,
                                    fontSize: '5px', // Adjust the font size as needed
                                    height: '20px', // Adjust the height as needed
                                    width: '20px',
                                }}
                                onClick={togglePopup}
                                icon={<CloseOutlined/>}
                            />
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
            </div>

            <Modal
                title="Add RGB"
                visible={isAddRGBModalOpen}
                onOk={handleAddRGBOk}
                onCancel={handleCancel}
            >
                <Form>
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
                </Form>
            </Modal>

            <Modal
                title="Add Data"
                visible={isAddModalOpen}
                onOk={handleAddOk}
                onCancel={handleCancel}
            >
                <Form style={modalContentStyle}>
                    <Form.Item label="Replicate" name="replicate">
                        <Input
                            value={newReplicate} onChange={(e) => setNewReplicate(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Sub-replicate" name="subReplicate">
                        <Input
                            value={newSubReplicate} onChange={(e) => setNewSubReplicate(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <Input
                            value={newDate} onChange={(e) => setNewDate(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Longitude" name="longitude">
                        <Input
                            value={newLongitude} onChange={(e) => setNewLongitude(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Latitude" name="latitude">
                        <Input
                            value={newLatitude} onChange={(e) => setNewLatitude(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Chlorophyll" name="chlorophyll">
                        <Input
                            value={newChlorophyll} onChange={(e) => setNewChlorophyll(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="P Conc" name="pConc">
                        <Input
                            value={newPConc} onChange={(e) => setNewPConc(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="K Conc" name="kConc">
                        <Input
                            value={newKConc} onChange={(e) => setNewKConc(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="N Conc" name="nConc">
                        <Input
                            value={newNConc} onChange={(e) => setNewNConc(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Wet weight" name="wetWeight">
                        <Input
                            value={newWetWeight} onChange={(e) => setNewWetWeight(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Dried weight" name="driedWeight">
                        <Input
                            value={newDriedWeight} onChange={(e) => setNewDriedWeight(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Moiture" name="moiture">
                        <Input
                            value={newMoiture} onChange={(e) => setNewMoiture(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Digesion" name="digesion">
                        <Input
                            value={newDigesion} onChange={(e) => setNewDigesion(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Confirm" open={isModalConfirmOpen} onOk={handleConfirmOk} onCancel={handleCancel}>
                <p>Confirm to create data?</p>
            </Modal>


        </>
    );
};

export default UserAbout;