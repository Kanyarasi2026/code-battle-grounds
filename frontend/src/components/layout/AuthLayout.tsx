import { Outlet } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './AuthLayout.scss';

export default function AuthLayout() {
  return (
    <>
      <div className="auth-layout__profile">
        <ProfileIcon />
      </div>
      <Outlet />
    </>
  );
}
