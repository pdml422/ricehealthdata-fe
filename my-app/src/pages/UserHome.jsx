import React, { useState } from 'react';
import axios from 'axios';
import { Button, notification } from 'antd';

const UserHome = () => {
    const [hdrFile, setHdrFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);

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
            formData.append('hdrFile', hdrFile);
            formData.append('imgFile', imgFile);

            const response = await axios.post('http://100.96.184.148:8000/image/hyper', formData, {
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

        } catch (error) {
            console.error('Error uploading files:', error.response?.data || error.message);

            // Show an error notification
            notification.error({
                message: 'Error',
                description: 'Failed to upload files. Please try again.',
            });
        }
    };

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
        </>
    );
};

export default UserHome;
