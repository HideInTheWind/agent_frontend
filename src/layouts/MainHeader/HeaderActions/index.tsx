import { Space } from "antd";

import ThemeSwitcher from "../../ThemeSwitcher";

const HeaderActions: React.FC = () => {
  return (
    <>
      <Space size="middle">
        <ThemeSwitcher />
      </Space>
    </>
  );
};

export default HeaderActions;
