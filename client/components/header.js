import Link from "next/link";

export default ({ currentUser }) => {
  let links = [
    !currentUser && {
      label: "Sign Up",
      href: "/auth/signup",
    },
    !currentUser && {
      label: "Sign In",
      href: "/auth/signin",
    },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && {
      label: "Sign Out",
      href: "/auth/signout",
    },
  ]
    .filter((linkConf) => linkConf)
    .map(({ label, href }) => (
      <li className="nav-item" key={href}>
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ));
  return (
    <nav className="navbar navbar-light bg-light ">
      <Link href="/">
        <a className="navbar-brand">Gitix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
