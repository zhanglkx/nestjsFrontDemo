import { Card, Upload, message, Table, Tag, Space, Button, Progress, Tabs } from 'antd';
import { InboxOutlined, CloudUploadOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadFile as uploadFileApi, uploadFiles as uploadFilesApi } from '@/api/user';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

interface FileRecord {
    id: string;
    name: string;
    size: number;
    url: string;
    uploadTime: string;
    status: 'success' | 'error' | 'uploading';
    progress?: number;
}

export default function FeatList() {
    const [fileList, setFileList] = useState<FileRecord[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');

    // 单文件上传
    const handleSingleUpload = async (file: File) => {
        const tempId = Date.now().toString();

        // 添加临时文件记录（显示上传中状态）
        const tempFile: FileRecord = {
            id: tempId,
            name: file.name,
            size: file.size,
            url: '',
            uploadTime: new Date().toLocaleString('zh-CN'),
            status: 'uploading',
            progress: 0,
        };

        setFileList(prev => [tempFile, ...prev]);
        setUploading(true);

        try {
            // 模拟上传进度
            const progressInterval = setInterval(() => {
                setFileList(prev => prev.map(item =>
                    item.id === tempId && item.progress! < 90
                        ? { ...item, progress: item.progress! + 10 }
                        : item
                ));
            }, 100);

            const result = await uploadFileApi(file);

            clearInterval(progressInterval);

            // 更新文件记录为成功状态
            setFileList(prev => prev.map(item =>
                item.id === tempId
                    ? {
                        ...item,
                        url: 'http://localhost:3000' + result.url,
                        status: 'success',
                        progress: 100,
                    }
                    : item
            ));

            message.success('文件上传成功！');
            return result;
        } catch (error) {
            // 更新为失败状态
            setFileList(prev => prev.map(item =>
                item.id === tempId
                    ? { ...item, status: 'error' }
                    : item
            ));
            message.error('文件上传失败，请重试');
            throw error;
        } finally {
            setUploading(false);
        }
    };

    // 多文件上传
    const handleMultipleUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const tempFiles: FileRecord[] = files.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            url: '',
            uploadTime: new Date().toLocaleString('zh-CN'),
            status: 'uploading',
            progress: 0,
        }));

        setFileList(prev => [...tempFiles, ...prev]);
        setUploading(true);

        try {
            // 模拟上传进度
            const progressInterval = setInterval(() => {
                setFileList(prev => prev.map(item => {
                    if (tempFiles.some(tf => tf.id === item.id) && item.progress! < 90) {
                        return { ...item, progress: item.progress! + 10 };
                    }
                    return item;
                }));
            }, 150);

            // 方式一：调用批量上传接口（如果后端支持）
            try {
                const results = await uploadFilesApi(files);
                clearInterval(progressInterval);

                // 更新所有文件为成功状态
                setFileList(prev => prev.map(item => {
                    const tempIndex = tempFiles.findIndex(tf => tf.id === item.id);
                    if (tempIndex !== -1) {
                        return {
                            ...item,
                            url: 'http://localhost:3000' + results[tempIndex].url,
                            status: 'success',
                            progress: 100,
                        };
                    }
                    return item;
                }));

                message.success(`成功上传 ${files.length} 个文件！`);
            } catch {
                // 方式二：如果批量接口不支持，则逐个上传
                clearInterval(progressInterval);

                const uploadPromises = files.map(async (file, index) => {
                    try {
                        const result = await uploadFileApi(file);

                        setFileList(prev => prev.map(item =>
                            item.id === tempFiles[index].id
                                ? {
                                    ...item,
                                    url: 'http://localhost:3000' + result.url,
                                    status: 'success',
                                    progress: 100,
                                }
                                : item
                        ));

                        return { success: true, result };
                    } catch (err) {
                        setFileList(prev => prev.map(item =>
                            item.id === tempFiles[index].id
                                ? { ...item, status: 'error', progress: 0 }
                                : item
                        ));
                        return { success: false, error: err };
                    }
                });

                const results = await Promise.all(uploadPromises);
                const successCount = results.filter(r => r.success).length;
                const failCount = results.length - successCount;

                if (successCount > 0) {
                    message.success(`成功上传 ${successCount} 个文件${failCount > 0 ? `，失败 ${failCount} 个` : '！'}`);
                } else {
                    message.error('所有文件上传失败');
                }
            }
        } catch {
            // 所有文件标记为失败
            setFileList(prev => prev.map(item =>
                tempFiles.some(tf => tf.id === item.id)
                    ? { ...item, status: 'error', progress: 0 }
                    : item
            ));
            message.error('文件上传失败，请重试');
        } finally {
            setUploading(false);
        }
    };

    // 单文件上传配置
    const singleUploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            // 文件大小限制 20MB
            const isLt20M = file.size / 1024 / 1024 < 20;
            if (!isLt20M) {
                message.error('文件大小不能超过 20MB!');
                return false;
            }

            handleSingleUpload(file);
            return false; // 阻止自动上传
        },
    };

    // 多文件上传配置
    const multipleUploadProps: UploadProps = {
        name: 'files',
        multiple: true,
        showUploadList: false,
        beforeUpload: (file, fileList) => {
            // 验证所有文件大小
            const invalidFiles = fileList.filter(f => f.size / 1024 / 1024 > 20);
            if (invalidFiles.length > 0) {
                message.error(`以下文件超过 20MB 限制：${invalidFiles.map(f => f.name).join(', ')}`);
                return false;
            }

            // 只在最后一个文件时触发上传（确保获取完整的文件列表）
            if (file === fileList[fileList.length - 1]) {
                handleMultipleUpload(fileList as File[]);
            }

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
            render: (name: string, record: FileRecord) => (
                <Space>
                    <FileOutlined style={{ color: record.status === 'success' ? '#52c41a' : record.status === 'error' ? '#ff4d4f' : '#1890ff' }} />
                    <span>{name}</span>
                </Space>
            ),
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
            width: 200,
            render: (status: string, record: FileRecord) => (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Tag color={status === 'success' ? 'green' : status === 'error' ? 'red' : 'blue'}>
                        {status === 'success' ? '上传成功' : status === 'error' ? '上传失败' : '上传中...'}
                    </Tag>
                    {status === 'uploading' && record.progress !== undefined && (
                        <Progress percent={record.progress} size="small" status="active" />
                    )}
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            render: (_: unknown, record: FileRecord) => (
                <Space>
                    {record.status === 'success' && (
                        <Button
                            type="link"
                            size="small"
                            href={record.url}
                            target="_blank"
                        >
                            查看
                        </Button>
                    )}
                    <Button
                        type="link"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        disabled={record.status === 'uploading'}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const tabItems = [
        {
            key: 'single',
            label: '单文件上传',
            children: (
                <Dragger {...singleUploadProps} disabled={uploading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">
                        点击或拖拽文件到此区域上传
                    </p>
                    <p className="ant-upload-hint">
                        支持单个文件上传，文件大小不超过 20MB
                    </p>
                </Dragger>
            ),
        },
        {
            key: 'multiple',
            label: '批量上传',
            children: (
                <Dragger {...multipleUploadProps} disabled={uploading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: '#52c41a' }} />
                    </p>
                    <p className="ant-upload-text">
                        点击或拖拽多个文件到此区域批量上传
                    </p>
                    <p className="ant-upload-hint">
                        支持同时选择多个文件上传，每个文件大小不超过 20MB
                    </p>
                </Dragger>
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
                        {uploading && <Tag color="processing">上传中...</Tag>}
                    </Space>
                }
                style={{ marginBottom: '24px' }}
            >
                <Tabs
                    items={tabItems}
                    activeKey={uploadMode}
                    onChange={(key) => setUploadMode(key as 'single' | 'multiple')}
                />
            </Card>

            <Card
                title={
                    <Space>
                        <span>文件列表</span>
                        <Tag color="blue">{fileList.length} 个文件</Tag>
                        {fileList.filter(f => f.status === 'success').length > 0 && (
                            <Tag color="green">成功 {fileList.filter(f => f.status === 'success').length}</Tag>
                        )}
                        {fileList.filter(f => f.status === 'error').length > 0 && (
                            <Tag color="red">失败 {fileList.filter(f => f.status === 'error').length}</Tag>
                        )}
                        {fileList.filter(f => f.status === 'uploading').length > 0 && (
                            <Tag color="processing">上传中 {fileList.filter(f => f.status === 'uploading').length}</Tag>
                        )}
                    </Space>
                }
                extra={
                    fileList.length > 0 && (
                        <Button
                            danger
                            onClick={() => {
                                setFileList([]);
                                message.success('已清空文件列表');
                            }}
                            disabled={uploading}
                        >
                            清空列表
                        </Button>
                    )
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