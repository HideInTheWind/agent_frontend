import React from "react";
import { Layout } from "antd";
import HeaderLogo from "./HeaderLogo";
import HeaderActions from "./HeaderActions";
import styles from "./MainHeader.module.scss";

const { Header } = Layout;

const MainHeader: React.FC = () => {
  return (
    <>
      <Header className={styles.mhHeader}>
        <HeaderLogo />
        <HeaderActions />
      </Header>
    </>
  );
};

export default MainHeader;
