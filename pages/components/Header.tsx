import Link from "next/link";

const Header = () => {
  return (
    <header className="menuContainer">
      <Link href="/">
        <a title="Home" className="logo">
          nerdQuiz
        </a>
      </Link>
      <nav className="menu">
        <Link href="/create">
          <a title="Create a Quiz">Create</a>
        </Link>
        <Link href="/rooms">
          <a title="Join a Quiz">Rooms</a>
        </Link>
        <Link href="/">
          <a title="Home">Home</a>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
