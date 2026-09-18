import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { ROUTES } from "@/constants";

const HeaderLogo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(ROUTES.DASHBOARD)}
      className={styles.logoBtn}
      aria-label="返回首页"
    >
      <img src="/hero.png" alt="Logo" className={styles.logoImg} />
      <div className={styles.titleGroup}>
        <span className={styles.title}>Agent服务管理系统</span>
        <span className={styles.subtitle}>岌岌无名不知名有限公司</span>
      </div>
    </button>
  );
};

export default HeaderLogo;
