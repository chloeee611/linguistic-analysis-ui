import { Paragraph } from "@/components/paragraph";

import styles from "./landing.module.scss";

export const Landing = () => {
    return (
        <div className={styles.container}>
            <div className={styles.landingImage}>
                <div className={styles.imageContainer}>
                    <img src="/src/assets/landing-page.jpg" />

                    <div className={styles.title}>A New Way to Analyse Linguistic Data</div>
                </div>
                <div className={styles.description}>
                    <Paragraph>A tool that makes linguistic analysis easier than ever before.</Paragraph>
                    <Paragraph>Analyse transcripts. Explore language. Visualise results.</Paragraph>
                    <Paragraph>Register or login to get started now.</Paragraph>
                </div>
            </div>
        </div>
    );
};
