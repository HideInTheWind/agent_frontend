import styles from "./index.module.scss";
import { useState } from "react";
import useAskStream from "@/hooks/useAskStream";
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  List,
  Space,
  Steps,
  Tag,
  Typography,
} from "antd";

const STEP_LABELS: Record<StreamStatus, string> = {
  routing: "路由",
  retrieving: "检索",
  researching: "研究",
  writing: "写作",
  reviewing: "审校",
};

const CONFIDENCE_CONFIG: Record<
  RouteConfidence,
  { label: string; color: string }
> = {
  high: { label: "高", color: "green" },
  medium: { label: "中", color: "gold" },
  low: { label: "低", color: "red" },
};

function Dashboard() {
  const [question, setQuestion] = useState("");
  const {
    loading,
    currentStatus,
    statusSteps,
    route,
    report,
    cacheHit,
    error,
    submit,
  } = useAskStream();

  const handleSubmit = () => {
    const q = question.trim();
    if (!q) return;
    submit(q);
  };

  const currentStepIndex = currentStatus
    ? statusSteps.indexOf(currentStatus)
    : -1;

  const confidenceConfig = route ? CONFIDENCE_CONFIG[route.confidence] : null;

  return (
    <div className={styles.container}>
      <Typography.Title level={2}>研究助手</Typography.Title>

      <Form className={styles.form} onFinish={handleSubmit}>
        <Form.Item className={styles.formItem}>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="输入你的问题..."
            disabled={loading}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!question.trim()}
        >
          提交
        </Button>
      </Form>

      {loading && (
        <div className={styles.progressSection}>
          <Typography.Text type="secondary">
            当前阶段：{currentStatus ? STEP_LABELS[currentStatus] : "连接中..."}
          </Typography.Text>
          <Steps
            size="small"
            current={currentStepIndex}
            status="process"
            items={statusSteps.map((step) => ({
              title: STEP_LABELS[step],
            }))}
            className={styles.steps}
          />
        </div>
      )}

      {cacheHit && (
        <Alert
          className={styles.alert}
          type="warning"
          title="命中缓存"
          showIcon
        />
      )}

      {route && (
        <Card className={styles.card} title="路由结果">
          <Space orientation="vertical" size="small">
            <Typography.Text>
              分类：<Tag color="blue">{route.category}</Tag>
            </Typography.Text>
            <Typography.Text>
              置信度：
              {confidenceConfig && (
                <Tag color={confidenceConfig.color}>
                  {confidenceConfig.label}
                </Tag>
              )}
            </Typography.Text>
            <Typography.Paragraph className={styles.reason}>
              {route.reason}
            </Typography.Paragraph>
          </Space>
        </Card>
      )}

      {error && (
        <Alert className={styles.alert} type="error" message={error} showIcon />
      )}

      {report && (
        <Card className={styles.card}>
          <Flex vertical gap="middle">
            <Typography.Title level={3} className={styles.reportTitle}>
              {report.title}
            </Typography.Title>
            <Typography.Paragraph>{report.summary}</Typography.Paragraph>
            <Typography.Title level={5} className={styles.sectionTitle}>
              章节
            </Typography.Title>
            <List
              size="small"
              bordered
              dataSource={report.sections}
              renderItem={(section) => <List.Item>{section}</List.Item>}
            />
            <Typography.Text>
              评分：{report.score} / 10
              <Tag color={report.approved ? "success" : "error"}>
                {report.approved ? "已通过" : "未通过"}
              </Tag>
            </Typography.Text>
          </Flex>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
