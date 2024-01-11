import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Modal, notification, Space, Table} from 'antd';

const UserHome = () => {
    const [hdrFile, setHdrFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const showDeleteModal = (stadata) => {
        setSelectedData(stadata);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteOk = async () => {
        setIsDeleteModalOpen(false);
        await deleteImageFile(selectedData);
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedData(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'hdr') {
            setHdrFile(file);
        } else if (fileType === 'img') {
            setImgFile(file);
        } else {
            // Show an error notification for unsupported file types
            notification.error({
                message: 'Error',
                description: 'Unsupported file type. Please choose an HDR (.hdr) or IMG (.img) file.',
            });
        }
    };

    const handleUploadFiles = async () => {
        try {
            if (!hdrFile || !imgFile) {
                // Show a notification or alert that both files are required
                notification.error({
                    message: 'Error',
                    description: 'Please choose both an HDR (.hdr) and an IMG (.img) file to upload.',
                });
                return;
            }

            // Continue with the upload logic...

            // Example: Construct FormData and make a POST request using Axios
            const formData = new FormData();
            formData.append('header', hdrFile); // 'hdr' is the key for HDR file
            formData.append('image', imgFile); // 'image' is the key for IMG file

            const response = await axios.post('http://100.96.184.148:8080/image/hyper', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            });

            // Handle the response...

            // Show a success notification
            notification.success({
                message: 'Success',
                description: 'Files uploaded successfully.',
            });
            await fetchImageFile();

        } catch (error) {
            console.error('Error uploading files:', error.response?.data || error.message);

            // Show an error notification
            notification.error({
                message: 'Error',
                description: 'Failed to upload files. Please try again.',
            });
        }
    };

    const fetchImageFile = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.get(`http://100.96.184.148:8080/image/hyper/${localStorage.getItem('userId')}`, config);
            console.log(response.data)
            setData(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteImageFile = async (stadata) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            await axios.delete(`http://100.96.184.148:8080/image/hyper/${stadata.id}`, configHeader);
            await fetchImageFile();
            notification.success({
                message: 'Data deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            notification.error({
                message: 'Error deleting file',
            });
        }
    };


    useEffect(() => {
        fetchImageFile();
    }, []);

        const columns  = [
            {
                title: 'File',
                width: 100,
                dataIndex: 'path',
                fixed: 'left',
                render: (text) => {
                    const fileName = text.split('/').pop(); // Extracts the filename from the path
                    return <span>{fileName}</span>;
                },
            },
            {
                title: 'Type',
                dataIndex: 'type',
                width: 120
            },
            {
                title: 'Action',
                fixed: 'right',
                width: 100,
                render: (text, record) => (
                    <Space size="middle">
                        <a style={{ color: 'red' }} onClick={() => showDeleteModal(record)}>
                            Delete
                        </a>
                    </Space>
                ),

            },
        ];





    return (
        <>
            {/* Choose HDR file input */}
            <input type="file" accept=".hdr" onChange={handleFileChange} />

            {/* Choose IMG file input */}
            <input type="file" accept=".img" onChange={handleFileChange} />

            {/* Upload Files button */}
            <Button onClick={handleUploadFiles} type="primary">
                Upload Files
            </Button>

            <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: 1500 }}
                sticky={{ offsetHeader: 64 }}
            />

            {selectedData && (
                <Modal
                    title="Confirm Delete"
                    visible={isDeleteModalOpen}
                    onOk={handleDeleteOk}
                    onCancel={handleCancel}
                >
                    <p>Are you sure you want to delete this file?</p>
                </Modal>
            )}

        </>
    );
};

export default UserHome;
