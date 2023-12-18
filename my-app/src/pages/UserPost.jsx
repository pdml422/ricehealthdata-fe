import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from "axios";

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Replicate',
        width: 100,
        dataIndex: 'replicate',
        fixed: 'left',
    },
    {
        title: 'Sub-replicate',
        width: 100,
        dataIndex: 'subReplicate',
        fixed: 'left',
    },
    {
        title: 'Date',
        width: 120,
        dataIndex: 'date',
        fixed: 'left',
    },
    {
        title: 'Cholorophyll',
        dataIndex: 'chlorophyll',
        width: 120,
    },
    {
        title: 'Longitude',
        dataIndex: 'longitude',
        width: 120,
    },
    {
        title: 'Latitude',
        dataIndex: 'latitude',
        width: 120,
    },
    {
        title: 'P Conc',
        dataIndex: 'PConc',
        width: 120,
    },
    {
        title: 'K Conc',
        dataIndex: 'KConc',
        width: 120,
    },
    {
        title: 'N Conc',
        dataIndex: 'NConc',
        width: 120,
    },
    {
        title: 'Wet Weight',
        dataIndex: 'wetWeight',
        width: 120,
    },
    {
        title: 'Dried Weight',
        dataIndex: 'driedWeight',
        width: 120,
    },
    {
        title: 'Moiture',
        dataIndex: 'moiture',
        width: 120,
    },
    {
        title: 'Digesion',
        dataIndex: 'digesion',
        width: 120
    },
    {
        title: 'Action',
        fixed: 'right',
        width: 100,
        render: () => <a>Edit</a>,
    },
];

const UserPost = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage] = useState(1);

    const fetchData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                params: {
                    page: currentPage,  // Send the current page as a query parameter
                },
            };

            const response = await axios.get('http://localhost:8080/statistical/searchAll', config);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: 1500 }}
            // antd site header height
            sticky={{ offsetHeader: 64 }}
        />
    );
};

export default UserPost;
