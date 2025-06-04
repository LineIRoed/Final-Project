import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <img
          src="/tmdb-logo.svg"
          alt="TMDb Logo"
          className={styles.logo}
        />
        <p>This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
      </a>
    </footer>
  )
}

