import './Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">
          <span className="navbar__logo-icon">◇</span>
        </div>
        <h1 className="navbar__title">Component Studio</h1>
      </div>

      <div className="navbar__actions">
        <button className="navbar__btn navbar__btn--secondary">
          <span className="navbar__btn-icon">↻</span>
          Reset
        </button>
        <button className="navbar__btn navbar__btn--secondary">
          <span className="navbar__btn-icon">👁</span>
          Preview
        </button>
        <button className="navbar__btn navbar__btn--primary">
          <span className="navbar__btn-icon">↓</span>
          Export
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
