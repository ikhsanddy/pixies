import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {DOCUMENTATION_BASE} from "@/common/utils/constants";

const GUIDES = [
    {title: "Linux setup", file: "setup/linux.md"},
    {title: "Windows setup", file: "setup/windows.md"},
    {title: "Reverse proxy", file: "guides/reverse-proxy.md"},
    {title: "HTTPS", file: "guides/https.md"},
    {title: "Statistics and charts", file: "guides/statistics.md"},
    {title: "The interface", file: "instructions/main.md"},
    {title: "Settings", file: "instructions/settings.md"},
    {title: "FAQ", file: "faq.md"},
    {title: "Troubleshooting", file: "troubleshooting.md"},
];

export const Tutorials = () => {
    return (
        <div className="tutorials-page">
            <div className="tutorials-header">
                <h1>Tutorials</h1>
                <p>Documentation for installing, configuring and using Pixies</p>
            </div>

            <section className="tutorials-section">
                <h2>Guides</h2>

                <div className="tutorials-grid">
                    {GUIDES.map((guide) => (
                        <a
                            key={guide.file}
                            className="tutorial-card doc-card"
                            href={`${DOCUMENTATION_BASE}/${guide.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faBookOpen}/>
                            <span>{guide.title}</span>
                        </a>
                    ))}

                    <Link className="tutorial-card add-card" to="/tutorials/submit">
                        <FontAwesomeIcon icon={faPlus}/>
                        <span>Submit a guide</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};
