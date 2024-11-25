import React, { useState } from 'react';
import axios from 'axios';
import './UploadPage.css';

const UploadPage = () => {
    const [uploadStatus, setUploadStatus] = useState('');
    const [statusType, setStatusType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadStatus('');
        setStatusType('');
    };

    const handleFileUpload = async() => {
        if (!selectedFile) {
            setStatusType('error');
            setUploadStatus('Please select a file to upload');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle column mismatch case from the backend
            if (response.data.message === 'Column attributes mismatch.') {
                setStatusType('warning');
                setUploadStatus(`Column mismatch detected: ${JSON.stringify(response.data.details)}`);
            } else {
                setStatusType('success');
                setUploadStatus(response.data.message || 'File uploaded successfully');
            }
            setSelectedFile(null);
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage =
                (error.response && error.response.data && error.response.data.message) ||
                'An error occurred during upload. Please ensure the file has the correct format and required columns.';
            setStatusType('error');
            setUploadStatus(`Error uploading file: ${String(errorMessage)}`);
        }
    };

    return ( <
        div className = "upload-container" >
        <
        h1 > File Upload < /h1> <
        span >
        <
        strong className = "red-text" > NOTE: < /strong> The file format should be '.CSV' or '.JSON'.
        If uploaded with '.XLSX', it will auto convert to CSV and upload. <
        br / >
        <
        br / >
        <
        div className = "required-columns-section" >
        <
        strong className = "align" > Required columns: < /strong> <
        span className = "blue-text" >
        Name, Reg_No, Year, School, Company, { ' ' } <
        span className = "blue-text" > ApplicationStatus < /span>{' '} <
        span className = "red-text" > (Applied, Shortlisted, Placed, Not placed) < /span>,{' '} <
        span className = "blue-text" > Category < /span>{' '} <
        span className = "red-text" >
        (Super dream internship, Super dream offer, Dream offer, Dream internship, Restricted dream offer) <
        /span>,{' '} <
        span className = "blue-text" > CTC < /span>{' '} <
        span className = "red-text" > (e.g., 20 LPA) < /span> <
        /span> <
        /div> <
        /span>

        <
        input type = "file"
        onChange = { handleFileChange }
        accept = ".csv,.json,.xlsx" / >
        <
        button className = "upload-button"
        onClick = { handleFileUpload }
        disabled = {!selectedFile } >
        Upload <
        /button>

        {
            uploadStatus && ( <
                p className = { statusType === 'success' ? 'success-message' : statusType === 'warning' ? 'warning-message' : 'error-message' } > { uploadStatus } <
                /p>
            )
        } <
        /div>
    );
};

export default UploadPage;