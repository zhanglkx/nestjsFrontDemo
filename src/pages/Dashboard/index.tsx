/**
 * Dashboard 首页
 */

import { Row, Col, Card, Statistic, Typography, Space } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store';
import styles from './index.module.css';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  const { user } = useAuthStore();

  const statisticsData = [
    {
      title: '用户总数',
      value: 1234,
      prefix: <UserOutlined />,
      valueStyle: { color: '#3f8600' },
      suffix: <ArrowUpOutlined />,
    },
    {
      title: '角色数量',
      value: 8,
      prefix: <SafetyOutlined />,
      valueStyle: { color: '#1890ff' },
    },
    {
      title: '菜单数量',
      value: 24,
      prefix: <MenuOutlined />,
      valueStyle: { color: '#722ed1' },
    },
    {
      title: '在线用户',
      value: 156,
      prefix: <TeamOutlined />,
      valueStyle: { color: '#cf1322' },
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <Title level={2}>
          👋 欢迎回来，{user?.username || '管理员'}！
        </Title>
        <Paragraph type="secondary">
          这是您的工作台，在这里您可以查看系统概览和快速访问各项功能。
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {statisticsData.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={styles.statisticCard} hoverable>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                valueStyle={item.valueStyle}
                suffix={item.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="快速操作" className={styles.quickActionsCard}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card.Grid
                className={styles.actionGrid}
                style={{ width: '50%' }}
                hoverable
              >
                <div className={styles.actionItem}>
                  <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div>
                    <div className={styles.actionTitle}>用户管理</div>
                    <div className={styles.actionDesc}>管理系统用户</div>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid
                className={styles.actionGrid}
                style={{ width: '50%' }}
                hoverable
              >
                <div className={styles.actionItem}>
                  <SafetyOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <div>
                    <div className={styles.actionTitle}>角色管理</div>
                    <div className={styles.actionDesc}>配置用户角色</div>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid
                className={styles.actionGrid}
                style={{ width: '50%' }}
                hoverable
              >
                <div className={styles.actionItem}>
                  <MenuOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                  <div>
                    <div className={styles.actionTitle}>菜单管理</div>
                    <div className={styles.actionDesc}>配置系统菜单</div>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid
                className={styles.actionGrid}
                style={{ width: '50%' }}
                hoverable
              >
                <div className={styles.actionItem}>
                  <TeamOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                  <div>
                    <div className={styles.actionTitle}>权限设置</div>
                    <div className={styles.actionDesc}>配置访问权限</div>
                  </div>
                </div>
              </Card.Grid>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="系统信息" className={styles.systemInfoCard}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>系统版本：</span>
              <span className={styles.infoValue}>v1.0.0</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>技术栈：</span>
              <span className={styles.infoValue}>
                React 19 + TypeScript + Vite + Ant Design 6.0
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>状态管理：</span>
              <span className={styles.infoValue}>Zustand</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>路由：</span>
              <span className={styles.infoValue}>React Router v7</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>UI 组件：</span>
              <span className={styles.infoValue}>Ant Design Pro Components</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>样式方案：</span>
              <span className={styles.infoValue}>CSS Modules</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
