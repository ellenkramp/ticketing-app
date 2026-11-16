import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link className="nav-link" href={href}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar gttx-nav">
      <div className="container gttx-nav-inner">
        <Link className="navbar-brand gttx-brand" href="/">
          GitTix
        </Link>
        <div className="d-flex justify-content-end align-items-center gap-3">
          {currentUser && (
            <span className="gttx-user">{currentUser.email}</span>
          )}
          <ul className="nav d-flex align-items-center mb-0">{links}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
