/**
 * 菜单管理页面
 */

import { useState, useEffect } from 'react';
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
  TreeSelect,
  InputNumber,
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
import { getMenuList, createMenu, updateMenu, deleteMenu } from '@/api';
import type { Menu, CreateMenuDTO, UpdateMenuDTO } from '@/types';
import { formatDateTime } from '@/utils';
import { USER_STATUS, MENU_TYPE } from '@/constants';
import styles from './index.module.css';

export default function MenuList() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (searchParams?: any) => {
    try {
      setLoading(true);
      const menuList = await getMenuList(searchParams);
      setMenus(menuList);
    } catch (error) {
      message.error('加载菜单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    await loadData(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadData();
  };

  const handleCreate = () => {
    setModalType('create');
    setCurrentMenu(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Menu) => {
    setModalType('edit');
    setCurrentMenu(record);
    form.setFieldsValue({
      ...record,
      parentId: record.parentId || null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMenu(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        const data: CreateMenuDTO = {
          name: values.name,
          path: values.path,
          icon: values.icon,
          parentId: values.parentId || null,
          orderNum: values.orderNum,
          type: values.type,
          permission: values.permission,
          status: values.status ?? USER_STATUS.NORMAL,
        };
        await createMenu(data);
        message.success('创建成功');
      } else {
        const data: UpdateMenuDTO = {
          id: currentMenu!.id,
          name: values.name,
          path: values.path,
          icon: values.icon,
          parentId: values.parentId || null,
          orderNum: values.orderNum,
          type: values.type,
          permission: values.permission,
          status: values.status,
        };
        await updateMenu(data);
        message.success('更新成功');
      }

      setModalVisible(false);
      form.resetFields();
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // 构建树形选择器数据
  const buildTreeData = (menuList: Menu[], excludeId?: number): any[] => {
    return menuList
      .filter((menu) => menu.id !== excludeId)
      .filter((menu) => !menu.parentId)
      .map((menu) => ({
        value: menu.id,
        title: menu.name,
        children: buildTreeChildren(menuList, menu.id, excludeId),
      }));
  };

  const buildTreeChildren = (menuList: Menu[], parentId: number, excludeId?: number): any[] => {
    const children = menuList
      .filter((menu) => menu.id !== excludeId)
      .filter((menu) => menu.parentId === parentId);
    
    if (children.length === 0) return undefined as any;
    
    return children.map((menu) => ({
      value: menu.id,
      title: menu.name,
      children: buildTreeChildren(menuList, menu.id, excludeId),
    }));
  };

  const columns: ColumnsType<Menu> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 80,
      render: (text) => text || 0,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => {
        const typeMap = {
          [MENU_TYPE.DIRECTORY]: { text: '目录', color: 'blue' },
          [MENU_TYPE.MENU]: { text: '菜单', color: 'green' },
          [MENU_TYPE.BUTTON]: { text: '按钮', color: 'orange' },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config?.color}>{config?.text || '-'}</Tag>;
      },
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      width: 150,
      ellipsis: true,
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
            title="确定要删除这个菜单吗？"
            description="删除后将无法恢复，且会删除子菜单"
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
    <div className={styles.menuList}>
      <Card className={styles.searchCard}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="name" label="菜单名称">
            <Input placeholder="请输入菜单名称" allowClear />
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
        title="菜单列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增菜单
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={menus}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={false}
          expandable={{
            defaultExpandAllRows: true,
          }}
        />
      </Card>

      <Modal
        title={modalType === 'create' ? '新增菜单' : '编辑菜单'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item name="parentId" label="上级菜单">
            <TreeSelect
              placeholder="请选择上级菜单（不选则为顶级菜单）"
              allowClear
              treeDefaultExpandAll
              treeData={buildTreeData(menus, currentMenu?.id)}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="菜单类型"
            rules={[{ required: true, message: '请选择菜单类型' }]}
            initialValue={MENU_TYPE.MENU}
          >
            <Select>
              <Select.Option value={MENU_TYPE.DIRECTORY}>目录</Select.Option>
              <Select.Option value={MENU_TYPE.MENU}>菜单</Select.Option>
              <Select.Option value={MENU_TYPE.BUTTON}>按钮</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: true, message: '请输入路径' }]}
          >
            <Input placeholder="请输入路径（如：/users）" />
          </Form.Item>

          <Form.Item name="icon" label="图标">
            <Input placeholder="请输入图标名称（如：UserOutlined）" />
          </Form.Item>

          <Form.Item name="orderNum" label="排序" initialValue={0}>
            <InputNumber
              min={0}
              max={9999}
              style={{ width: '100%' }}
              placeholder="数字越小越靠前"
            />
          </Form.Item>

          <Form.Item name="permission" label="权限标识">
            <Input placeholder="请输入权限标识（如：user:list）" />
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
