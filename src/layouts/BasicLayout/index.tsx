import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";
import styles from "./index.module.scss";
import MainHeader from "@/layouts/MainHeader/MainHeader";
import HeaderPageMeta from "../MainHeader/HeaderPageMeta";
import { ROUTES } from "@/constants";

const { Content } = Layout;

const BasicLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === ROUTES.DASHBOARD;

  return (
    <Layout className={styles.layout}>
      <MainHeader />
      <HeaderPageMeta />
      <Content
        className={`${styles.content}${isDashboard ? ` ${styles.contentScroll}` : ""}`}
      >
        <div
          className={
            !isDashboard ? styles.pageBodyFill : styles.withoutDashboard
          }
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};
export default BasicLayout;
