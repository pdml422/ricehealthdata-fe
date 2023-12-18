import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
    },
    {
        title: 'Sub-replicate',
        width: 100,
        dataIndex: 'age',
        key: 'age',
        fixed: 'left',
    },
    {
        title: 'Date',
        width: 120,
        dataIndex: 'address',
        key: 'age',
        fixed: 'left',
    },
    {
        title: 'Chlorophyll',
        dataIndex: 'address',
        key: '1',
        width: 120,
    },
    {
        title: 'Longitude',
        dataIndex: 'address',
        key: '2',
        width: 120,
    },
    {
        title: 'Latitude',
        dataIndex: 'address',
        key: '3',
        width: 120,
    },
    {
        title: 'P Conc',
        dataIndex: 'address',
        key: '4',
        width: 120,
    },
    {
        title: 'K Conc',
        dataIndex: 'address',
        key: '5',
        width: 120,
    },
    {
        title: 'N Conc',
        dataIndex: 'address',
        key: '6',
        width: 120,
    },
    {
        title: 'Wet Weight',
        dataIndex: 'address',
        key: '7',
        width: 120,
    },
    {
        title: 'Dried Weight',
        dataIndex: 'address',
        key: '8',
        width: 120,
    },
    {
        title: 'Moiture',
        dataIndex: 'address',
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

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        name: `Ed ${i}`,
        age: 32,
        address: `4.99999 ${i}`,
    });
}

const Post: React.FC = () => {
    const [fixedTop] = useState(false);

    return (
        <Table
            columns={columns}
            dataSource={data}
            scroll={{ x: 1500 }}
            summary={() => (
                <Table.Summary fixed={fixedTop ? 'top' : 'bottom'}>
                </Table.Summary>
            )}
            // antd site header height
            sticky={{ offsetHeader: 64 }}
        />
    );
};

export default Post
