import "./styles.sass";
import Button from "@/common/components/Button/index.js";
import {faHome, faPaperPlane, faCheckCircle, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ISSUES_URL = "https://github.com/ikhsanddy/pixies/issues";

export const TutorialSubmission = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const typeParam = new URLSearchParams(location.search).get("type");

    const [type, setType] = useState(typeParam || "guide");
    const [contentUrl, setContentUrl] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const postTutorial = async (ev) => {
        ev.preventDefault();

        const body = [
            `**Type:** ${type}`,
            `**Content URL:** ${contentUrl}`,
            "",
            message
        ].join("\n");

        window.open(
            `${ISSUES_URL}/new?title=${encodeURIComponent("Tutorial submission")}` +
            `&body=${encodeURIComponent(body)}`,
            "_blank"
        );
        setSuccess(true);
    }

    if (success) {
        return (
            <div className="submission-page">
                <div className="success-state">
                    <div className="success-icon">
                        <FontAwesomeIcon icon={faCheckCircle}/>
                    </div>
                    <h1>Submission Started</h1>
                    <p>Your browser opened a pre-filled GitHub issue. Submit it there to finish sharing
                        your {type}.</p>
                    <Button 
                        icon={faHome} 
                        text="Back to Home" 
                        color="primary"
                        onClick={() => navigate("/")}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="submission-page">
            <div className="submission-container">
                <div className="submission-header">
                    <h1>Submit a Tutorial</h1>
                    <p>Share your Pixies content with the community</p>
                </div>

                <div className="submission-content">
                    <form className="submission-form" onSubmit={postTutorial}>
                        <input type="hidden" name="honeypot" style={{display: "none"}}/>
                        
                        <div className="form-group">
                            <label htmlFor="type">Content Type</label>
                            <select 
                                id="type" 
                                value={type} 
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="guide">Guide</option>
                                <option value="video">Video</option>
                                <option value="blog">Blog Post</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="content-url">Content URL</label>
                            <input 
                                type="url" 
                                id="content-url" 
                                value={contentUrl}
                                onChange={(e) => setContentUrl(e.target.value)}
                                placeholder={type === "blog" ? "https://example.com/your-blog-post" : "https://youtube.com/watch?v=..."}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Additional Notes <span className="optional">(optional)</span></label>
                            <textarea 
                                id="message" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Anything you'd like us to know?"
                                rows={4}
                            />
                        </div>

                        <div className="form-checkbox">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                required
                            />
                            <label htmlFor="terms">I confirm this is my original content and follows the guidelines</label>
                        </div>

                        <Button 
                            icon={faPaperPlane} 
                            text="Submit Tutorial" 
                            color="primary"
                            size="lg"
                            disabled={!agreed}
                        />
                    </form>

                    <aside className="guidelines">
                        <div className="guidelines-header">
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            <h3>Submission Guidelines</h3>
                        </div>
                        
                        <ul>
                            <li>Submissions are handled as a GitHub issue in the project repository</li>
                            <li>Content must be publicly accessible</li>
                            <li>Must be related to Pixies (tutorial, review, guide, etc.)</li>
                            <li>You must be the original creator of the content</li>
                        </ul>
                    </aside>
                </div>
            </div>
        </div>
    );
}
