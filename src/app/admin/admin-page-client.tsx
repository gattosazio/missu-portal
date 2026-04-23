import styles from "@/components/admin/admin-panel.module.css";

const recentEvents = [
  {
    type: "Ingest",
    title: "Visitor Access Policy uploaded",
    detail: "Version 2.1 queued for embedding and review.",
    time: "2 mins ago",
  },
  {
    type: "Ask Test",
    title: "Security escort question checked",
    detail: "Returned policy-grounded answer with 2 citations.",
    time: "11 mins ago",
  },
  {
    type: "Audit",
    title: "Voice session interaction logged",
    detail: "Captured user query, response mode, and confidence.",
    time: "25 mins ago",
  },
];

const quickMetrics = [
  { label: "Policies", value: "128" },
  { label: "Queued", value: "06" },
  { label: "Audit Logs", value: "2.4k" },
];

export function AdminPageClient() {
  return (
    <section className={styles.panel}>
      <div className={styles.layout}>
        <div className={styles.primaryColumn}>
          <section className={`${styles.card} ${styles.heroCard}`}>
            <div className={styles.cardGlow} />
            <div className={styles.cardInner}>
              <div className={styles.heroHeader}>
                <div>
                  <p className={styles.kicker}>Admin Workspace</p>
                  <h2 className={styles.heroTitle}>Manage policy ingestion and validation.</h2>
                </div>

                <div className={styles.metrics}>
                  {quickMetrics.map((metric) => (
                    <div key={metric.label} className={styles.metricPill}>
                      <span className={styles.metricValue}>{metric.value}</span>
                      <span className={styles.metricLabel}>{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className={styles.dualGrid}>
            <section className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.sectionHeader}>
                  <div>
                    <p className={styles.sectionKicker}>Policy Ingest</p>
                    <h3 className={styles.sectionTitle}>Upload or paste a policy payload</h3>
                  </div>

                  <button type="button" className={styles.secondaryButton}>
                    Add File
                  </button>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Document Title</label>
                  <input
                    className={styles.input}
                    placeholder="Visitor Access Policy"
                    type="text"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Policy Metadata</label>
                  <div className={styles.metaGrid}>
                    <input className={styles.input} placeholder="Policy Type" type="text" />
                    <input className={styles.input} placeholder="Site" type="text" />
                    <input className={styles.input} placeholder="Department" type="text" />
                    <input className={styles.input} placeholder="Jurisdiction" type="text" />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Ingest JSON Payload</label>
                  <textarea
                    className={styles.textarea}
                    placeholder='{"title":"Visitor Access Policy","content":"..."}'
                  />
                </div>

                <div className={styles.actionRow}>
                  <button type="button" className={styles.primaryButton}>
                    Ingest Policy
                  </button>
                  <button type="button" className={styles.ghostButton}>
                    Validate Payload
                  </button>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.sectionHeader}>
                  <div>
                    <p className={styles.sectionKicker}>Ask Test</p>
                    <h3 className={styles.sectionTitle}>Run a question against the corpus</h3>
                  </div>

                  <span className={styles.statusBadge}>Sandbox</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Question</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Can visitors enter restricted areas without an escort?"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Scope Filters</label>
                  <div className={styles.metaGrid}>
                    <input className={styles.input} placeholder="Policy Type" type="text" />
                    <input className={styles.input} placeholder="Site" type="text" />
                    <input className={styles.input} placeholder="Department" type="text" />
                    <input className={styles.input} placeholder="Jurisdiction" type="text" />
                  </div>
                </div>

                <div className={styles.actionRow}>
                  <button type="button" className={styles.primaryButton}>
                    Run Test
                  </button>
                  <button type="button" className={styles.ghostButton}>
                    Clear
                  </button>
                </div>

                <div className={styles.responsePreview}>
                  <div className={styles.previewHeader}>
                    <span className={styles.previewLabel}>Latest Result</span>
                    <span className={styles.previewMode}>policy_specific</span>
                  </div>
                  <p className={styles.previewText}>
                    No, visitors cannot enter restricted areas without an escort unless they
                    have temporary access approved by Security.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionKicker}>Activity</p>
                  <h3 className={styles.sectionTitle}>Recent admin events</h3>
                </div>
              </div>

              <div className={styles.eventList}>
                {recentEvents.map((event) => (
                  <article key={`${event.type}-${event.title}`} className={styles.eventItem}>
                    <div className={styles.eventMeta}>
                      <span className={styles.eventType}>{event.type}</span>
                      <span className={styles.eventTime}>{event.time}</span>
                    </div>
                    <h4 className={styles.eventTitle}>{event.title}</h4>
                    <p className={styles.eventDetail}>{event.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionKicker}>System Notes</p>
                  <h3 className={styles.sectionTitle}>Operator reminders</h3>
                </div>
              </div>

              <ul className={styles.noteList}>
                <li className={styles.noteItem}>Confirm metadata before ingesting new policy versions.</li>
                <li className={styles.noteItem}>Use scoped ask tests for site-specific validation.</li>
                <li className={styles.noteItem}>Review low-confidence responses before publishing updates.</li>
              </ul>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
