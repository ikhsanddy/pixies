import "./styles.sass";
import {faDocker, faLinux, faWindows} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCopy} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {DOCUMENTATION_BASE, DOCUMENTATION_ROOT} from "@/common/utils/constants";

export const INSTALL_CMD =
    "curl -sSL https://raw.githubusercontent.com/ikhsanddy/pixies/master/scripts/install.sh | bash";

export const Install = () => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(INSTALL_CMD);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    const openDocs = (path) => window.open(DOCUMENTATION_BASE + "/" + path, "_blank");

    return (
        <div className="install-page">
            <div className="install-container">
                <div className="install-header">
                    <h1>Install Pixies</h1>
                    <p>Get up and running in minutes with our simple installation process</p>
                </div>

                <div className="quick-install">
                    <div className="quick-install-header">
                        <h2>Quick Install</h2>
                        <p>Run this single command on any Linux system</p>
                    </div>
                    <div className="command-row" onClick={copyToClipboard}>
                        <code>{INSTALL_CMD}</code>
                        <button className={`copy-btn ${isCopied ? "copied" : ""}`}>
                            <FontAwesomeIcon icon={isCopied ? faCheck : faCopy}/>
                            <span>{isCopied ? "Copied!" : "Copy"}</span>
                        </button>
                    </div>
                </div>

                <div className="divider">
                    <span>or choose your platform</span>
                </div>

                <div className="install-options">
                    <button className="install-option" onClick={() => openDocs("setup/linux.md")}>
                        <FontAwesomeIcon icon={faLinux}/>
                        <div className="option-text">
                            <strong>Linux</strong>
                            <span>Manual installation guide</span>
                        </div>
                    </button>

                    <button className="install-option" onClick={() => openDocs("setup/windows.md")}>
                        <FontAwesomeIcon icon={faWindows}/>
                        <div className="option-text">
                            <strong>Windows</strong>
                            <span>Windows setup instructions</span>
                        </div>
                    </button>

                    <button className="install-option" onClick={() => openDocs("setup/linux.md#installation-with-docker")}>
                        <FontAwesomeIcon icon={faDocker}/>
                        <div className="option-text">
                            <strong>Docker</strong>
                            <span>Container deployment</span>
                        </div>
                    </button>
                </div>

                <div className="help-section">
                    <p>Need help getting started?</p>
                    <div className="help-links">
                        <a onClick={() => openDocs("faq.md")}>FAQ</a>
                        <a onClick={() => openDocs("troubleshooting.md")}>Troubleshooting</a>
                        <a onClick={() => window.open(DOCUMENTATION_ROOT, "_blank")}>Documentation</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
