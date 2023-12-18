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
        key: 'name',
        fixed: 'left',
    },
    {
        title: 'Sub-replicate',
        width: 100,
        dataIndex: 'sub-replicate',
        key: 'age',
        fixed: 'left',
    },
    {
        title: 'Date',
        width: 120,
        dataIndex: 'date',
        key: 'age',
        fixed: 'left',
    },
    {
        title: 'Cholorophyll',
        dataIndex: 'cholorophyll',
        key: '1',
        width: 120,
    },
    {
        title: 'Longitude',
        dataIndex: 'longitude',
        key: '2',
        width: 120,
    },
    {
        title: 'Latitude',
        dataIndex: 'latitude',
        key: '3',
        width: 120,
    },
    {
        title: 'P Conc',
        dataIndex: 'PConc',
        key: '4',
        width: 120,
    },
    {
        title: 'K Conc',
        dataIndex: 'KConc',
        key: '5',
        width: 120,
    },
    {
        title: 'N Conc',
        dataIndex: 'KConc',
        key: '6',
        width: 120,
    },
    {
        title: 'Wet Weight',
        dataIndex: 'wetWeight',
        key: '7',
        width: 120,
    },
    {
        title: 'Dried Weight',
        dataIndex: 'driedWeight',
        key: '8',
        width: 120,
    },
    {
        title: 'Moiture',
        dataIndex: 'moisture',
        key: '9',
        width: 120,
    },
    { title: 'Digesion', dataIndex: 'address', key: '10', width: 120},
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <a>Edit</a>,
    },
];

const UserPost = () => {
    const [data, setData] = useState([]);
    const [loading] = useState(true);

    const getData = async () => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get('http://localhost:8080/statistical/search', configHeader);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

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
