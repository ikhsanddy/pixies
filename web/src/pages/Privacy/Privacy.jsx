import "./styles.sass";

const ISSUES_URL = "https://github.com/ikhsanddy/pixies/issues";

export const Privacy = () => {
    return (
        <div className="legal-page privacy-page">
            <div className="legal-container">
                <h1>Privacy Policy</h1>

                <section className="legal-section">
                    <h2>1. Privacy at a glance</h2>
                    <h3>General information</h3>
                    <p>The following notes explain what happens with data when you visit this website. Personal data is
                        any data that can be used to identify you. This page is a static project page: it has no user
                        accounts, no contact forms and no server-side storage operated by the project itself.</p>
                    <h3>Who is responsible for data processing?</h3>
                    <p>This website is a static project page. The party responsible for processing personal data is
                        whoever operates the deployment you are currently visiting.</p>
                    <h3>How is data collected?</h3>
                    <p>No personal data is submitted by you through this page beyond what your browser sends with any
                        normal request. Technical request data (for example IP address, user agent and time of access)
                        may be processed by the hosting provider in server logs to deliver the site and to detect
                        abuse.</p>
                    <h4>What do we use your data for?</h4>
                    <p>Technical data is processed only to provide the site reliably and securely. It is not used for
                        profiling, advertising or tracking.</p>
                    <h4>What rights do you have?</h4>
                    <p>You have the right to information about, correction of, and deletion of personal data concerning
                        you, as well as the right to restrict or object to its processing, where the applicable law
                        provides these rights. You may also lodge a complaint with a supervisory authority.</p>
                </section>

                <section className="legal-section">
                    <h2>2. Hosting and content delivery</h2>
                    <p>This site is served as static files. The hosting or content delivery provider used for a given
                        deployment may process technical request data in server logs and may apply its own security
                        measures such as request filtering. This processing is necessary to deliver the site and is
                        based on the operator's legitimate interest in a secure, performant website.</p>
                    <p>The provider's own privacy documentation applies to that processing. No cookies are set by this
                        page for analytics or advertising.</p>
                </section>

                <section className="legal-section">
                    <h2>3. Local storage</h2>
                    <p>This page stores a small amount of technical data in your browser's local storage, for example
                        the theme or the selected language of the documentation. This data never leaves your device
                        and can be removed at any time by clearing the site data in your browser.</p>
                </section>

                <section className="legal-section">
                    <h2>4. External links</h2>
                    <p>This site links to external resources, including the project repository on GitHub. When you
                        follow such a link, the privacy policy of the target site applies. No content from those sites
                        is embedded here.</p>
                </section>

                <section className="legal-section">
                    <h2>5. Contact</h2>
                    <p>Questions about this policy and requests regarding data processing can be raised through the
                        project's issue tracker:
                        <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer"> GitHub Issues</a>.</p>
                </section>
            </div>
        </div>
    )
}
