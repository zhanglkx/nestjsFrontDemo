import { Card, Upload, message, Table, Tag, Space, Button } from 'antd';
import { InboxOutlined, CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadFile as uploadFileApi } from '@/api/user';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

interface FileRecord {
    id: string;
    name: string;
    size: number;
    url: string;
    uploadTime: string;
    status: 'success' | 'error' | 'uploading';
}

export default function FeatList() {
    const [fileList, setFileList] = useState<FileRecord[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File) => {
        setUploading(true);

        try {
            const result = await uploadFileApi(file);

            // 添加到文件列表
            const newFile: FileRecord = {
                id: Date.now().toString(),
                name: file.name,
                size: file.size,
                url: 'http://localhost:3000' + result.url,
                uploadTime: new Date().toLocaleString('zh-CN'),
                status: 'success',
            };

            setFileList(prev => [newFile, ...prev]);
            message.success('文件上传成功！');

            return result;
        } catch (error) {
            message.error('文件上传失败，请重试');
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            // 文件大小限制 20MB
            const isLt10M = file.size / 1024 / 1024 < 20;
            if (!isLt10M) {
                message.error('文件大小不能超过 20MB!');
                return false;
            }

            handleUpload(file);
            return false; // 阻止自动上传
        },
    };

    const handleDelete = (id: string) => {
        setFileList(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    };

    const columns = [
        {
            title: '文件名',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            key: 'size',
            width: 120,
            render: (size: number) => formatFileSize(size),
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
            width: 180,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={status === 'success' ? 'green' : 'red'}>
                    {status === 'success' ? '成功' : '失败'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            render: (_: unknown, record: FileRecord) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        href={record.url}
                        target="_blank"
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title={
                    <Space>
                        <CloudUploadOutlined />
                        <span>文件上传管理</span>
                    </Space>
                }
                style={{ marginBottom: '24px' }}
            >
                <Dragger {...uploadProps} disabled={uploading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">
                        点击或拖拽文件到此区域上传
                    </p>
                    <p className="ant-upload-hint">
                        支持单个文件上传，文件大小不超过 10MB
                    </p>
                </Dragger>
            </Card>

            <Card
                title={
                    <Space>
                        <span>文件列表</span>
                        <Tag color="blue">{fileList.length} 个文件</Tag>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={fileList}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `共 ${total} 条`,
                        showSizeChanger: true,
                    }}
                    locale={{
                        emptyText: '暂无文件，请先上传文件',
                    }}
                />
            </Card>
        </div>
    );
}