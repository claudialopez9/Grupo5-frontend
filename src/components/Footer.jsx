function Footer() {
  return (
    <footer className="bg-dark text-light py-1 mt-5">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div className="d-flex align-items-center mb-1 mb-md-0">
          <img
            src="/img/logo-footer.svg"
            alt="Logo Biblioteca UTN"
            height="60"
            className="me-3"
          />
        </div>

        <small>© 2026 Biblioteca UTN — Facultad Regional Tucumán</small>
      </div>
    </footer>
  );
}

export default Footer;