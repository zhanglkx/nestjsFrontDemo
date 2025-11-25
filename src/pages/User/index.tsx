/**
 * 用户管理页面
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useUserStore } from '@/store';
import { getAllRoles } from '@/api';
import type { User, CreateUserDTO, UpdateUserDTO, Role } from '@/types';
import { formatDateTime } from '@/utils';
import { USER_STATUS } from '@/constants';
import styles from './index.module.css';

// API 返回的用户数据结构（用作角色选择）
interface UserRoleData {
  id: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function UserList() {
  const { users, total, loading, currentPage, pageSize, fetchUsers, addUser, editUser, removeUser, setPage, setPageSize } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      await fetchUsers();
    } catch {
      message.error('加载用户列表失败');
    }
  }, [fetchUsers]);

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, loadData]);

  useEffect(() => {
    async function loadRolesData() {
      try {
        const roleList = await getAllRoles();
        // 将返回的用户数据映射为角色格式
        const mappedRoles = (roleList as unknown as UserRoleData[]).map((item) => ({
          id: item.id as unknown as number, // API 返回的是字符串 id
          name: item.username,              // 使用 username 作为角色名
          code: item.role,                  // 使用 role 作为角色代码
          status: 1,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
        setRoles(mappedRoles);
      } catch {
        console.error('加载角色列表失败');
      }
    }
    loadRolesData();
  }, []);

  const handleSearch = async (values: { username?: string; email?: string; status?: number }) => {
    try {
      await fetchUsers(values);
    } catch {
      message.error('搜索失败');
    }
  };

  const handleReset = useCallback(() => {
    searchForm.resetFields();
    loadData();
  }, [searchForm, loadData]);

  const handleCreate = () => {
    setModalType('create');
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setModalType('edit');
    setCurrentUser(record);
    form.setFieldsValue({
      ...record,
      password: undefined, // 编辑时不显示密码
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await removeUser(id);
      message.success('删除成功');
    } catch {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        const data: CreateUserDTO = {
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
          roleId: values.roleId,
          status: values.status ?? USER_STATUS.NORMAL,
        };
        await addUser(data);
        message.success('创建成功');
      } else {
        const data: UpdateUserDTO = {
          id: currentUser!.id,
          username: values.username,
          email: values.email,
          phone: values.phone,
          roleId: values.roleId,
          status: values.status,
        };
        await editUser(data);
        message.success('更新成功');
      }

      setModalVisible(false);
      form.resetFields();
    } catch {
      message.error('操作失败');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) =>
        status === USER_STATUS.NORMAL ? (
          <Tag color="success">正常</Tag>
        ) : (
          <Tag color="error">禁用</Tag>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text) => formatDateTime(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.userList}>
      <Card className={styles.searchCard}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入用户名" allowClear />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Select.Option value={USER_STATUS.NORMAL}>正常</Select.Option>
              <Select.Option value={USER_STATUS.DISABLED}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="用户列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增用户
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      <Modal
        title={modalType === 'create' ? '新增用户' : '编辑用户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          {modalType === 'create' && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item name="roleId" label="角色">
            <Select placeholder="请选择角色" allowClear>
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue={USER_STATUS.NORMAL}>
            <Select>
              <Select.Option value={USER_STATUS.NORMAL}>正常</Select.Option>
              <Select.Option value={USER_STATUS.DISABLED}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
