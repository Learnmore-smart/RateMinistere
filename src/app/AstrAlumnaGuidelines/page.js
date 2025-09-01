'use client';
import { useTranslation } from 'react-i18next';
import styles from './AstrAlumnaGuidelines.module.css';
import Tooltip from '../components/Tooltip';
import { Undo2 } from 'lucide-react';

const AstrAlumnaGuidelines = () => {
    const { t } = useTranslation();

    const handleUndo = () => {
        window.history.back();
    }

    const Section = ({ titleKey, children }) => (
        <section className={styles.section}>
            <h2 className={styles.subheading}>{t(titleKey)}</h2>
            {children}
        </section>
    );

    const Subsection = ({ titleKey, children }) => (
        <div className={styles.subsection}>
            <h3 className={styles.subsubheading}>{t(titleKey)}</h3>
            {children}
        </div>
    );

    return (
        <div className={styles.container}>
            <Tooltip text="Go back">
                <button className={styles['undo-button']} onClick={handleUndo}>
                    <Undo2 size={24} />
                </button>
            </Tooltip>
            <h1 className={styles.title}>{t('AstrAlumnaGuidelines.title')}</h1>
            <p className={styles.intro}>{t('AstrAlumnaGuidelines.intro')}</p>
            <p className={styles.philosophy}>{t('AstrAlumnaGuidelines.philosophy')}</p>

            {/* Improve the Discussion */}
            <Section titleKey="AstrAlumnaGuidelines.improveDiscussion.title">
                <p>{t('AstrAlumnaGuidelines.improveDiscussion.desc')}</p>
                <ul className={styles.recommendationsList}>
                    <li>{t('AstrAlumnaGuidelines.improveDiscussion.browse')}</li>
                    <li>{t('AstrAlumnaGuidelines.improveDiscussion.positive')}</li>
                    <li>{t('AstrAlumnaGuidelines.improveDiscussion.relevance')}</li>
                </ul>
            </Section>

            {/* Be Agreeable, Even When You Disagree */}
            <Section titleKey="AstrAlumnaGuidelines.agreeable.title">
                <p>{t('AstrAlumnaGuidelines.agreeable.desc')}</p>
                <Subsection titleKey="AstrAlumnaGuidelines.agreeable.avoidTitle">
                    <ul className={styles.warningList}>
                        {[
                            'nameCalling',
                            'adHominem',
                            'toneResponses',
                            'contradiction'
                        ].map(key => (
                            <li key={key}>{t(`AstrAlumnaGuidelines.agreeable.avoid.${key}`)}</li>
                        ))}
                    </ul>
                </Subsection>
                <Subsection titleKey="AstrAlumnaGuidelines.agreeable.betterTitle">
                    <p>{t('AstrAlumnaGuidelines.agreeable.betterDesc')}</p>
                </Subsection>
            </Section>

            {/* Your Participation Counts */}
            <Section titleKey="AstrAlumnaGuidelines.yourParticipationCounts.title">
                <p>{t('AstrAlumnaGuidelines.yourParticipationCounts.desc')}</p>
                <p>{t('AstrAlumnaGuidelines.yourParticipationCounts.tools')}</p>
            </Section>

            {/* If You See a Problem, Flag It */}
            <Section titleKey="AstrAlumnaGuidelines.ifYouSeeAProblem.title">
                <p>{t('AstrAlumnaGuidelines.ifYouSeeAProblem.desc')}</p>
                <p>{t('AstrAlumnaGuidelines.ifYouSeeAProblem.moderators')}</p>
            </Section>

            {/* Always Be Civil */}
            <Section titleKey="AstrAlumnaGuidelines.alwaysBeCivil.title">
                <p>{t('AstrAlumnaGuidelines.alwaysBeCivil.desc')}</p>
                <Subsection>
                    <ul className={styles.rulesList}>
                        <li>{t('AstrAlumnaGuidelines.alwaysBeCivil.rules.beCivil')}</li>
                        <li>{t('AstrAlumnaGuidelines.alwaysBeCivil.rules.keepItClean')}</li>
                        <li>{t('AstrAlumnaGuidelines.alwaysBeCivil.rules.respectEachOther')}</li>
                        <li>{t('AstrAlumnaGuidelines.alwaysBeCivil.rules.respectForum')}</li>
                    </ul>
                </Subsection>

                <p>{t('AstrAlumnaGuidelines.alwaysBeCivil.publicForum')}</p>
            </Section>

            {/* Keep it Tidy */}
            <Section titleKey="AstrAlumnaGuidelines.keepItTidy.title">
                <p>{t('AstrAlumnaGuidelines.keepItTidy.desc')}</p>
                <Subsection>
                    <ul className={styles.rulesList}>
                        <li>{t('AstrAlumnaGuidelines.keepItTidy.rules.rightCategory')}</li>
                        <li>{t('AstrAlumnaGuidelines.keepItTidy.rules.noCrossPosting')}</li>
                        <li>{t('AstrAlumnaGuidelines.keepItTidy.rules.noContentReplies')}</li>
                        <li>{t('AstrAlumnaGuidelines.keepItTidy.rules.stayOnTopic')}</li>
                        <li>{t('AstrAlumnaGuidelines.keepItTidy.rules.noSignatures')}</li>
                    </ul>
                </Subsection>
                <Subsection>
                    <ul className={styles.recommendationsList}>
                        <li>{t('AstrAlumnaGuidelines.keepItTidy.alternatives.plusOne')}</li>
                        <li>{t('AstrAlumnaGuidelines.keepItTidy.alternatives.newTopic')}</li>
                    </ul>
                </Subsection>
            </Section>

            {/* Post Only Your Own Stuff */}
            <Section titleKey="AstrAlumnaGuidelines.postOnlyYourOwnStuff.title">
                <p>{t('AstrAlumnaGuidelines.postOnlyYourOwnStuff.desc')}</p>
            </Section>

            {/* Powered by You */}
            <Section titleKey="AstrAlumnaGuidelines.poweredByYou.title">
                <p>{t('AstrAlumnaGuidelines.poweredByYou.desc')}</p>
                <p>{t('AstrAlumnaGuidelines.poweredByYou.contact')}</p>
            </Section>

            {/* Moderation Note and Contact Us remain unchanged */}
            <div className={styles.importantNote}>
                <div className={styles.noteIcon}>!</div>
                <p>{t('AstrAlumnaGuidelines.moderationNote')}</p>
            </div>

            <div className={styles.contactSection}>
                <h3 className={styles.contactHeading}>{t('AstrAlumnaGuidelines.contactUs')}</h3>
                <address className={styles.address}>
                    {/* Assuming you have these translations elsewhere */}
                    {t('privacyPolicy.contact.address.company')}<br />
                    {t('privacyPolicy.contact.address.city')}<br />
                    {t('privacyPolicy.contact.address.country')}<br />
                    <a href={`mailto:${t('privacyPolicy.contact.address.email')}`} className={styles.address}>
                        {t('privacyPolicy.contact.address.email')}
                    </a>
                </address>
            </div>
        </div>
    );
};

export default AstrAlumnaGuidelines;