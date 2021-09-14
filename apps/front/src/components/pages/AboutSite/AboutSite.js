/**
 * About Site
 */
import React from 'react';
import { Header } from '../../organisms/Header/Header';
import { Trans, useTranslation } from 'react-i18next';
import './AboutSite.scss';

/**
 * About Site
 * @param {object} props
 */
export function AboutSite() {
  const { t } = useTranslation();

  return (
    <div>
      <Header id="home-about-site"></Header>
      <section id="about-site">
        <div className="row header">
          <div className="three column header-col">
            <h1>
              <span>{t('about_site.title')}</span>
            </h1>
          </div>
          <div className="nine column main-col">
            <p className="lead">{t('about_site.desc')}</p>
          </div>
        </div>
        <div id="front" className="category row">
          <div className="three column header-col">
            <h3>
              <span>{t('about_site.front.title')}</span>
            </h3>
          </div>
          <div className="nine column main-col">
            <dl>
              <dt>{t('about_site.front.library.title')}</dt>
              <dd>&bull; {t('about_site.front.library.item1')}</dd>
              <dd>
                &bull;{' '}
                <Trans i18nKey="about_site.front.library.item2">
                  HTTP Client:{' '}
                  <a href="https://github.com/axios/axios">Axios</a>
                </Trans>
              </dd>
              <dd>
                &bull;{' '}
                <Trans i18nKey="about_site.front.library.item3">
                  State Container: <a href="https://redux.js.org/">Redux</a> and{' '}
                  <a href="https://redux.js.org/">Redux Thunk</a>
                </Trans>
              </dd>
              <dd>
                &bull;{' '}
                <Trans i18nKey="about_site.front.library.item4">
                  Form:{' '}
                  <a href="https://react-hook-form.com/">React Hook Form</a>
                </Trans>
              </dd>
              <dd>&bull; {t('about_site.front.library.item5')}</dd>
            </dl>
            <dl>
              <dt>{t('about_site.front.design.title')}</dt>
              <dd>
                &bull;{' '}
                <Trans i18nKey="about_site.front.design.item1">
                  Ceevee theme{' '}
                  <a href="https://www.styleshout.com/free-templates/ceevee/">
                    Styleshout
                  </a>
                </Trans>
              </dd>
            </dl>
          </div>
        </div>
        <div id="back" className="category row">
          <div className="three column header-col">
            <h3>
              <span>{t('about_site.back.title')}</span>
            </h3>
          </div>
          <div className="nine column main-col">
            <dl>
              <dt>{t('about_site.back.language.title')}</dt>
              <dd>&bull; {t('about_site.back.language.item1')}</dd>
            </dl>
            <dl>
              <dt>{t('about_site.back.framework.title')}</dt>
              <dd>&bull; {t('about_site.back.framework.item1')}</dd>
              <dd>
                &bull;{' '}
                <Trans i18nKey="about_site.back.framework.item2">
                  Rest API by{' '}
                  <a href="https://github.com/FriendsOfSymfony/FOSRestBundle">
                    FOSRestBundle
                  </a>
                </Trans>
              </dd>
              <dd>
                &bull;{' '}
                <Trans i18nKey="about_site.back.framework.item3">
                  JWT token authentication{' '}
                  <a href="https://github.com/lexik/LexikJWTAuthenticationBundle">
                    LexikJWTAuthenticationBundle
                  </a>
                </Trans>
              </dd>
            </dl>
          </div>
        </div>
        <div id="infra" className="category row">
          <div className="three column header-col">
            <h3>
              <span>{t('about_site.infra.title')}</span>
            </h3>
          </div>
          <div className="nine column main-col">
            <dl>
              <dt>{t('about_site.infra.container.title')}</dt>
              <dd>&bull; {t('about_site.infra.container.item1')}</dd>
              <dd>&bull; {t('about_site.infra.container.item2')}</dd>
            </dl>
            <dl>
              <dt>{t('about_site.infra.hosting.title')}</dt>
              <dd>&bull; {t('about_site.infra.hosting.item1')}</dd>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
