import { Header } from '../Header/Header';
import './pageLayout.scss';
export const PageLayout = ({ children }) => (
  <div className="page-layout">
    <div className="page-layout-container">
      <Header />
      <main className="page-layout-container-content">
        {children}
      </main>
    </div>
  </div>
);
