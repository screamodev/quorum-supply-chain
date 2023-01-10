import { Link } from 'react-router-dom';
import './header.scss';

export const Header = () => {

  return (
    <div className="header">
      <Link to="/">
        <div className="header-logo">
          quorum supply
        </div>
      </Link>

      <nav className="header-navbar">
        <Link to="/" className="header-navbar-item">Orders</Link>
        <Link to="/create-order" className="header-navbar-item">Create order</Link>
      </nav>
    </div>
  );
};
