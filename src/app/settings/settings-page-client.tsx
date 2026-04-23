"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "@/components/settings/settings-panel.module.css";

const THEME_KEY = "missu-theme";

function applyTheme(nextTheme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", nextTheme === "dark");
  localStorage.setItem(THEME_KEY, nextTheme);
}

export function SettingsPageClient() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const rootIsDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(rootIsDark);
  }, []);

  function handleThemeToggle() {
    const nextValue = !isDarkMode;
    setIsDarkMode(nextValue);
    applyTheme(nextValue ? "dark" : "light");
  }

  return (
    <section className={styles.panel}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Preferences</p>
            <h2 className={styles.title}>Account settings</h2>
            <p className={styles.description}>
              Manage your profile, account security, and interface preferences from one place.
            </p>
          </div>

          <div className={styles.syncCard}>Last synced with your device preferences</div>
        </div>

        <div className={styles.grid}>
          <div className={styles.primaryColumn}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Account &amp; Profile</h3>
                <p className={styles.sectionDescription}>
                  Personal information, credentials, and account actions.
                </p>
              </div>

              <div className={styles.cardGrid}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>Personal Information</h4>
                    <p className={styles.cardDescription}>
                      Update the details your teammates see across the portal.
                    </p>
                  </div>

                  <div className={styles.formStack}>
                    <label className={styles.field}>
                      <span className={styles.label}>Full name</span>
                      <input
                        defaultValue="Art Manalo"
                        className={styles.input}
                      />
                    </label>

                    <label className={styles.field}>
                      <span className={styles.label}>Email address</span>
                      <input
                        defaultValue="art@missu.portal"
                        type="email"
                        className={styles.input}
                      />
                    </label>

                    <label className={styles.field}>
                      <span className={styles.label}>Role</span>
                      <input
                        defaultValue="Operations Lead"
                        className={styles.input}
                      />
                    </label>

                    <Button className={styles.actionButton}>Save profile</Button>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>Credentials</h4>
                    <p className={styles.cardDescription}>
                      Keep your account secure with password and verification controls.
                    </p>
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.infoTile}>
                      <div className={styles.infoTitle}>Password</div>
                      <div className={styles.infoText}>Last updated 21 days ago</div>
                    </div>

                    <div className={styles.infoTile}>
                      <div className={styles.infoTitle}>Two-factor authentication</div>
                      <div className={styles.infoText}>Not enabled on this account</div>
                    </div>

                    <div className={styles.buttonRow}>
                      <Button variant="outline">Change password</Button>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.dangerCard}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardTitle}>Account Actions</h4>
                  <p className={styles.cardDescription}>
                    Use these actions carefully. They affect your current access and sessions.
                  </p>
                </div>

                <div className={styles.buttonRow}>
                  <Button variant="outline">Sign out other devices</Button>
                  <Button variant="destructive">Deactivate account</Button>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.sideColumn}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Appearance &amp; Accessibility</h3>
                <p className={styles.sectionDescription}>
                  Adjust how the workspace looks and feels on this device.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleCopy}>
                    <h4 className={styles.cardTitle}>Dark mode</h4>
                    <p className={styles.cardDescription}>
                      Switch the portal between light and dark themes.
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-pressed={isDarkMode}
                    onClick={handleThemeToggle}
                    className={`${styles.switch} ${isDarkMode ? styles.switchActive : ""}`}
                  >
                    <span
                      className={`${styles.switchThumb} ${isDarkMode ? styles.switchThumbActive : ""}`}
                    />
                    <span className={styles.srOnly}>Toggle dark mode</span>
                  </button>
                </div>

                <div className={styles.themeStatus}>
                  Current theme: <span className={styles.themeValue}>{isDarkMode ? "Dark" : "Light"}</span>
                </div>
              </div>

              <div className={styles.card}>
                <h4 className={styles.cardTitle}>Reading comfort</h4>
                <p className={styles.cardDescription}>
                  Additional accessibility controls can live here later, such as text scaling,
                  reduced motion, or contrast preferences.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
