import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../../util/client";

const logout = async () => {
  client.authStore.clear();
};

const Header = ({ isLoggedIn }) => (
  <header className="container">
    <nav>
      <ul>
        <li>
          <Link to="/">
            <h1>Visited</h1>
          </Link>
        </li>
        {!isLoggedIn && (
          <li>
            <Link to="/auth">
              <h3>Login / Sign Up</h3>
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/visits">
                <h3>Visits</h3>
              </Link>
            </li>
            <li>
              <Link to="/map">
                <h3>Map</h3>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  </header>
);

const Footer = () => <footer className="container"></footer>;

function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (client.authStore.isValid) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/auth");
    }
  }, [client.authStore.isValid]);
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
