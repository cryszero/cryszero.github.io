import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';

import DrawingCanvas from '../../components/DrawingCanvas';

import myPhoto from '../../static/images/me.jpg';
import reactIcon from '../../static/images/react.svg';
import librariesImage from '../../static/images/libraries.jpeg';
import companyImage from '../../static/images/company.jpg';

import './homepage.scss';

const startCareerDate = new Date(15269364e5);


const Homepage = () => {
    const [isLongDescriptionOpen, setIsLongDescriptionOpen] = useState(false);

    return (
        <main className="homepage">
            <section className="homepage__introduction section">
                <div className="wrapper">
                    <div className="section__text">
                        <h1 className="section__title">
                            Привет, меня зовут Алексей!
                        </h1>
                        <h2 className="section__subtitle">
                            Вот уже&nbsp;
                            <span className="introduction__experience">
                                {formatDistanceToNow(
                                    startCareerDate,
                                    {
                                        locale: ruLocale    
                                    }
                                )}
                            </span>
                            &nbsp;я занимаюсь коммерческой Frontend-разработкой.<br/>
                            За это время я успел столкнуться с большим количеством технологий, а также сложностей разного характера. Далее я постараюсь как можно более интересно рассказать о моём опыте.
                        </h2>
                    </div>
                    <div className="section__image-wrapper">
                        <img className="section__image section__image--canvas" src={myPhoto} alt="My photo from Budapest" />
                        <DrawingCanvas
                            className="section__canvas"
                            height={300}
                            width={300}
                        />
                    </div>
                </div>
            </section>
        <section className="homepage__main-framework section">
            <div className="wrapper">
                <img className="section__image" src={reactIcon} alt="React logo" />
                <div className="section__text">
                    <h2 className="section__title">
                        Любимый фреймворк
                    </h2>
                    <p className="section__subtitle">
                        Больше всего мне довелось поработать с React (назовём его фреймворком, так как зачастую он идёт в связке с Redux и React-Router для разработки SPA). За всё это время я успел проникнуться идеологией этой библиотеки, знаю её сильные и слабые стороны, по крайней мере я на это надеюсь :)<br/>
                        Мне очень нравится, в какую сторону движется его разработка, в частности переход к функциональному программированию и хукам. Это делает мой код проще и понятнее для окружающих.
                    </p>
                </div>
            </div>
        </section>
        <section className="homepage__portfolio section">
            <div className="wrapper">
                <div className="section__text">
                    <h2 className="section__title">
                        Над чем я работал?&nbsp;
                        <a
                            className="section__toggle"
                            onClick={() => setIsLongDescriptionOpen(!isLongDescriptionOpen)}
                        >
                            {isLongDescriptionOpen ? 'Развёрнуто' : 'Кратко'}
                        </a>
                    </h2>
                    {isLongDescriptionOpen ?
                        (
                            <p className="section__subtitle">
                                Помимо SPA на React, я успел столкнуться ещё со многими другими видами фронтенда, расскажу, как оно было.<br/><br/>
                                Самой, наверное, масштабной моей работой по разработке сайта была работа над <a href="https://coincom.ru" target="_blanc" rel="noreferrer noopener">coincom.ru</a>. <b>(стоит отметить, что я над ним не работаю с середины 2019 года, но большая часть сделанного мной на месте)</b> Я сверстал все стили и разметку для этого сайта, написал скрипты для карты, модалок, слайдеров итд. Пришлось работать над контроллерами страниц с бэкенда на php (Yii2 фреймворк) как для открытых страничек, так и для админки.<br/><br/>
                                Примерно 3-4 месяца поработал с AngularJS 1.5, над SPA проектом. Концепция работы этого фреймворка мне тогда очень понравилась.<br/><br/>
                                Около 5-6 месяцев я занимался легаси SPA проектом на Backbone. Это тот ещё адок :)<br/><br/>
                                Была ещё пара интересных проектов: SPA-форум на jQuery (Backbone тут просто отдыхает, поди разберись где что всплывёт при нажатии на что угодно) и SPA на смеси Angular и React, хотя Angular там почти не использовался и в основном был нужен скорее для хранения глобального состояния.
                            </p>
                        ) : (
                            <p className="section__subtitle">
                                Коротко говоря, я работал более чем на паре десятков разного типа проектов.<br/>
                                Будь то обычные проекты на HTML и голом (+ jQuery) JS, так и разные SPA проекты с фреймворками различной популярности и актуальности.
                            </p>
                        )
                    }
                </div>
                <img className="section__image" src={librariesImage} alt="Node modules folder is very big" />
            </div>
        </section>
        <section className="homepage__companies section">
            <div className="wrapper">
                <img className="section__image" src={companyImage} alt="Meme about HTML" />
                <div className="section__text">
                    <h2 className="section__title">
                        Где я работал?
                    </h2>
                    <ul className="section__list experience-list">
                        <li className="experience-list__item">
                            <span className="experience-list__position">
                                Junior Frontend Developer
                            </span>
                            <span className="experience-list__company">
                                Unit6
                            </span>
                            <span className="experience-list__dates">
                                Июнь 2018 - Май 2019
                            </span>
                        </li>
                        <li className="experience-list__item">
                            <span className="experience-list__position">
                                Frontend Developer
                            </span>
                            <span className="experience-list__company">
                                Dr. Web
                            </span>
                            <span className="experience-list__dates">
                                Июнь 2019 - по наст. время
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <section className="homepage__skills section">
            <div className="wrapper">
                <h2 className="section__title">
                    Примерный стек технологий
                </h2>
                <ul className="section__list skills">
                    <li className="skills__item">
                        HTML5
                    </li>
                    <li className="skills__item">
                        CSS3
                    </li>
                    <li className="skills__item">
                        Vanilla JS
                    </li>
                    <li className="skills__item">
                        React
                    </li>
                    <li className="skills__item">
                        Redux
                    </li>
                    <li className="skills__item">
                        SASS
                    </li>
                    <li className="skills__item">
                        jQuery
                    </li>
                </ul>
                <p className="section__subtitle">
                    Ну и немножко работал с:
                </p>
                <ul className="section__list skills skills--smaller">
                    <li className="skills__item">
                        AngularJS 1.5
                    </li>
                    <li className="skills__item">
                        Backbone
                    </li>
                    <li className="skills__item">
                        Vue
                    </li>
                    <li className="skills__item">
                        php
                    </li>
                    <li className="skills__item">
                        Yii2
                    </li>
                    <li className="skills__item">
                        Webpack
                    </li>
                    <li className="skills__item">
                        и многие другие библиотеки узкого назначения
                    </li>
                </ul>
            </div>
        </section>
        <section className="homepage__contacts section">
            <div className="wrapper">
                <h2 className="section__title">
                    Контакты    
                </h2>
                <p className="section__contact-row">
                    <a href="https://github.com/cryszero" className="section__link section__link--github" target="_blank" rel="noopener noreferrer">
                        Гитхаб
                    </a>
                    <span>
                        давненько не пополняется, но можно всякое старьё посмотреть
                    </span>
                </p>
                <p className="section__contact-row">
                    <a href="https://vk.com/xddx23" className="section__link section__link--vk" target="_blank" rel="noopener noreferrer">
                        VK
                    </a>
                </p>
            </div>
        </section>
    </main>
    );
};

export default Homepage;