import "./styles.sass";
import Screenshot1 from "@/common/assets/sc1.png";
import Screenshot2 from "@/common/assets/sc2.png";
import Screenshot1400 from "@/common/assets/sc1-400.webp";
import Screenshot1800 from "@/common/assets/sc1-800.webp";
import Screenshot11200 from "@/common/assets/sc1-1200.webp";
import Screenshot2400 from "@/common/assets/sc2-400.webp";
import Screenshot2800 from "@/common/assets/sc2-800.webp";
import Screenshot21200 from "@/common/assets/sc2-1200.webp";

export const Features = () => {
    return (
        <section className="features-section">
            <div className="feature-block">
                <div className="feature-content">
                    <span className="feature-label">Automated Testing</span>
                    <h3>Set it and forget it</h3>
                    <p>
                        Configure your test schedule once and let Pixies handle the rest. 
                        Tests run automatically in the background with support for multiple providers.
                    </p>
                </div>
                <div className="feature-image">
                    <picture>
                        <source
                            type="image/webp"
                            srcSet={`${Screenshot1400} 400w, ${Screenshot1800} 800w, ${Screenshot11200} 1200w`}
                            sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 900px) calc(100vw - 4rem), 534px"
                        />
                        <img
                            src={Screenshot1}
                            alt="Automated speed testing interface"
                            width="1905"
                            height="998"
                            loading="lazy"
                            fetchPriority="low"
                            decoding="async"
                        />
                    </picture>
                </div>
            </div>

            <div className="feature-block feature-reverse">
                <div className="feature-content">
                    <span className="feature-label">Analytics</span>
                    <h3>Track your performance</h3>
                    <p>
                        View your speed history with clear visualizations. Identify patterns, 
                        detect issues, and keep your ISP accountable.
                    </p>
                </div>
                <div className="feature-image">
                    <picture>
                        <source
                            type="image/webp"
                            srcSet={`${Screenshot2400} 400w, ${Screenshot2800} 800w, ${Screenshot21200} 1200w`}
                            sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 900px) calc(100vw - 4rem), 534px"
                        />
                        <img
                            src={Screenshot2}
                            alt="Speed test analytics dashboard"
                            width="2400"
                            height="1350"
                            loading="lazy"
                            fetchPriority="low"
                            decoding="async"
                        />
                    </picture>
                </div>
            </div>
        </section>
    )
}