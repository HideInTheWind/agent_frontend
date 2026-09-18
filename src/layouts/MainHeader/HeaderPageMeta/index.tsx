import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import styles from "./index.module.scss";
import { ROUTES } from "@/constants";

const HeaderPageMeta: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const breadcrumbItems = (() => {
    const items: { title: React.ReactNode }[] = [
      {
        title:
          currentPath === ROUTES.DASHBOARD ? (
            "Dashboard"
          ) : (
            <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
          ),
      },
    ];
    // if (currentPath === ROUTES.DISKS) items.push({ title: "磁盘管理" });
    // else if (currentPath === ROUTES.DISKS_GROUPS)
    //   items.push({ title: "磁盘组管理" });
    return items;
  })();

  if (currentPath === ROUTES.DASHBOARD) return null;

  return (
    <>
      <div className={styles.breadcrumb}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {/* <div className={styles.pageTitle}>
        <h1 className={styles.pageTitleText}>
          {currentPath === ROUTES.DISKS ? "磁盘管理" : "磁盘组管理"}
        </h1>
      </div> */}
    </>
  );
};

export default HeaderPageMeta;
