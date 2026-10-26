import "./styles.sass";

const ISSUES_URL = "https://github.com/ikhsanddy/pixies/issues";

export const Imprint = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <h1>Imprint</h1>
                
                <section className="legal-section">
                    <h2>Project information</h2>
                    <p>Pixies is an open-source project maintained by its contributors. This website is a static
                        project page; it is not operated as a commercial service.</p>
                </section>

                <section className="legal-section">
                    <h2>Contact</h2>
                    <p>Questions, issue reports and content concerns:
                        <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer"> GitHub Issues</a></p>
                </section>
            </div>
        </div>
    )
}
