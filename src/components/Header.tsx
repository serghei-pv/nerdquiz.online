import Link from "next/link";
import styles from "../styles/header.module.css";

function Header(): React.ReactElement {
  return (
    <header className={styles.container}>
      <Link href="/">
        <a title="Home" className={styles.logo}>
          nerd<span className={styles.logoSpan}>Quiz</span>
        </a>
      </Link>
      <nav className={styles.menu}>
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
}

export default Header;
