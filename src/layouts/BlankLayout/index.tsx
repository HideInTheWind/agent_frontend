import { Outlet } from 'react-router-dom'
import styles from './index.module.scss'

export default function BlankLayout() {
  return (
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  )
}
