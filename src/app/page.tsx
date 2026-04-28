"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  useEffect(() => {
    const nav = document.getElementById("landing-nav");
    const onScroll = () => {
      if (window.scrollY > 20) nav?.classList.add("scrolled");
      else nav?.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".landing-root .reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div className="landing-root">
      <nav id="landing-nav" className="landing-nav">
        <div className="landing-nav-wrap">
          <Link href="/" className="landing-logo">
            tildra
            <span style={{ color: "var(--accent)", fontStyle: "normal" }}>/</span>
          </Link>
          <Link href="/app" className="landing-nav-cta">
            Попробовать
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-main">
              <div className="oneliner">AI-редактор Tilda для фрилансеров</div>
              <h1>
                Закрывай <em>пакеты правок</em>
                <br />
                клиентов в <em>5×</em> быстрее.
                <br />
                <em>Просто открываешь</em> — одна правка за раз,
                <br />
                всё остальное за тебя.
              </h1>
            </div>

            <aside className="hero-side">
              <ul className="micro-jobs">
                <li>
                  <span className="num">01</span>
                  <span>
                    Меняй цены сразу по всем странам и платёжным операторам одним
                    промптом
                  </span>
                </li>
                <li>
                  <span className="num">02</span>
                  <span>
                    Обновляй даты, месяцы и периоды акций перед запуском кампаний
                  </span>
                </li>
                <li>
                  <span className="num">03</span>
                  <span>
                    Заменяй картинки одним перетаскиванием — Zero Block не открываешь
                  </span>
                </li>
              </ul>
              <Link href="/app" className="cta-primary">
                Подключить страницу за 30 сек
                <span className="arrow">↗</span>
              </Link>
            </aside>
          </div>

          {/* Demo card */}
          <div className="demo">
            <div className="demo-head">
              <div className="demo-dot"></div>
              <div className="demo-dot"></div>
              <div className="demo-dot"></div>
              <div className="demo-url">tildra.app / clients / saas-landing.de</div>
            </div>
            <div className="demo-body">
              <div className="demo-input">
                <span className="demo-label">{"// промпт"}</span>
                <div className="demo-prompt">
                  В блоке цен для <span className="tag">Германии</span>
                  у оператора <span className="tag">Stripe</span>
                  <br />
                  замени <span className="tag">49€</span> →{" "}
                  <span className="tag">59€</span>
                  <span className="demo-cursor"></span>
                </div>
                <span className="demo-label" style={{ marginTop: "auto" }}>
                  {"// время выполнения · 47s"}
                </span>
              </div>
              <div className="demo-output">
                <span className="demo-label">
                  {"// превью на тестовой странице"}
                </span>
                <div className="price-card">
                  <div>
                    <div className="country">DE / Stripe / Basic</div>
                    <div style={{ marginTop: 6 }}>
                      <span className="price">19€</span>
                    </div>
                  </div>
                  <div className="country">no change</div>
                </div>
                <div className="price-card changed">
                  <div>
                    <div className="country">DE / Stripe / Pro</div>
                    <div style={{ marginTop: 6 }}>
                      <span className="price-old">49€</span>
                      <span className="price">59€</span>
                    </div>
                  </div>
                  <div className="country" style={{ color: "var(--accent)" }}>
                    updated
                  </div>
                </div>
                <div className="price-card">
                  <div>
                    <div className="country">DE / Stripe / Enterprise</div>
                    <div style={{ marginTop: 6 }}>
                      <span className="price">199€</span>
                    </div>
                  </div>
                  <div className="country">no change</div>
                </div>
                <div className="demo-status">ready to publish</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AHA */}
      <section className="aha reveal">
        <div className="container">
          <div className="section-num">01 / aha-момент</div>
          <h2 className="section-title">
            Прожить <em>«а так можно было?»</em> за 2 минуты.
          </h2>

          <div className="aha-grid">
            <div className="aha-card">
              <div className="step">step 01</div>
              <h3>Вставь ссылку на свою опубликованную Tilda-страницу.</h3>
              <p>
                Никаких логинов и интеграций. Напиши «поменяй цену 49€ → 59€ для
                Германии у Stripe» — и через минуту получишь готовое превью без
                открытия редактора Тильды.
              </p>
            </div>
            <div className="aha-card">
              <div className="step">step 02</div>
              <h3>Открой превью «было / стало» бок о бок.</h3>
              <p>
                Убедись, что вёрстка не поехала. Кнопка «Опубликовать» — это всё, что
                отделяет тебя от готового результата на боевом сайте клиента.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="reveal">
        <div className="container">
          <div className="section-num">02 / что вы получите</div>
          <h2 className="section-title">
            Не инструмент. <em>Усилитель практики.</em>
          </h2>

          <div className="values">
            <div className="value">
              <span className="value-num">01</span>
              <h3>Закрываешь пакет правок за 30 минут вместо 3 часов</h3>
              <p>
                Берёшь больше задач в день без переработок. Кликинг по Zero Block
                остаётся в прошлом.
              </p>
            </div>
            <div className="value">
              <span className="value-num">02</span>
              <h3>Отвечаешь клиенту в день обращения, а не «к концу недели»</h3>
              <p>
                Клиент не уходит к более быстрому фрилансеру. Срочные правки в
                пятницу больше не превращаются в выходной.
              </p>
            </div>
            <div className="value">
              <span className="value-num">03</span>
              <h3>Берёшь +3–5 клиентов на поддержку при том же времени</h3>
              <p>
                Масштабируешь практику без найма джуна и без переработок. Доход
                растёт, рабочие часы — нет.
              </p>
            </div>
            <div className="value">
              <span className="value-num">04</span>
              <h3>Публикуешь без страха</h3>
              <p>
                Превью на тестовой странице + история версий с откатом за 1 клик. То,
                чего у самой Тильды нет — у нас в коробке.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECOGNIZE */}
      <section className="reveal">
        <div className="container">
          <div className="section-num">03 / узнаёте себя?</div>
          <h2 className="recognize-title">
            Хочешь масштабировать <span className="accent">практику</span>
            <br />
            и перестать упираться в потолок
            <br />
            <em>личных часов?</em>
          </h2>

          <div className="triggers">
            <div className="trigger">
              <span className="q">→</span>
              Клиент в пятницу вечером пишет «срочно поменяй цены везде на сайте перед
              понедельником»?
            </div>
            <div className="trigger">
              <span className="q">→</span>
              Третий час сидишь в Zero Block, копируя один блок под 5 разных тарифов?
            </div>
            <div className="trigger">
              <span className="q">→</span>
              Даёшь скидку клиенту, лишь бы он не ушёл к фрилансеру, который «делает
              быстрее»?
            </div>
            <div className="trigger">
              <span className="q">→</span>
              Раздражает, что 80% твоей работы — это однотипный кликинг по элементам
              Тильды?
            </div>
            <div className="trigger">
              <span className="q">→</span>
              Боишься опубликовать правку — один раз уже сломал клиентский сайт перед
              запуском?
            </div>
            <div className="trigger">
              <span className="q">→</span>
              Не хватает рук, чтобы взять ещё клиентов — а нанимать джуна и обучать
              его дольше, чем сделать самому?
            </div>
          </div>
        </div>
      </section>

      {/* SOLVE */}
      <section className="reveal">
        <div className="container">
          <div className="section-num">04 / как вы решите свою работу</div>
          <h2 className="section-title">
            Три задачи. <em>Один поток.</em>
          </h2>

          <div className="core-jobs">
            <article className="core-job">
              <div className="core-job-text">
                <span className="core-job-tag">Job 01 · скорость</span>
                <h3>
                  <em>Закрыть</em> пакет правок клиента в 5–10× быстрее.
                </h3>
                <p className="lead">
                  Когда клиент прислал «обновите всё к понедельнику», у тебя 30 минут
                  на ответ — а не два дня на работу.
                </p>
              </div>
              <ul className="core-job-list">
                <li>
                  <div>
                    <b>Подключи страницу по ссылке за 30 секунд.</b>
                    <span>
                      Не тратишь время на логины и переходы между проектами.
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Опиши правку текстом или прикрепи скрин.</b>
                    <span>AI делает работу. Ты не кликаешь по Tilda-элементам.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Получи превью на тестовой странице за 1 минуту.</b>
                    <span>
                      Видишь результат до того, как он попадёт на прод клиента.
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Опубликуй одной кнопкой.</b>
                    <span>
                      Правка уезжает на боевой сайт клиента без открытия Тильды.
                    </span>
                  </div>
                </li>
              </ul>
            </article>

            <article className="core-job">
              <div className="core-job-text">
                <span className="core-job-tag">Job 02 · zero block</span>
                <h3>
                  Не <em>верстать руками</em> типовые правки Zero Block.
                </h3>
                <p className="lead">
                  То, что ты делал тремя часами кликов, AI делает одним промптом. С
                  тем же результатом.
                </p>
              </div>
              <ul className="core-job-list">
                <li>
                  <div>
                    <b>Замена картинки перетаскиванием файла.</b>
                    <span>Zero Block не открываешь ни разу.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Цены по странам и операторам обновляются явным контекстом.</b>
                    <span>
                      «В блоке цен для Германии у Stripe замени 49€ → 59€» — и всё.
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>AI спрашивает уточнение, если непонятно.</b>
                    <span>
                      Никаких сюрпризов на боевом сайте. Никаких best-guess вслепую.
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Даты и месяцы меняются за один промпт.</b>
                    <span>«Март → апрель в hero-блоке» — готово.</span>
                  </div>
                </li>
              </ul>
            </article>

            <article className="core-job">
              <div className="core-job-text">
                <span className="core-job-tag">Job 03 · качество</span>
                <h3>
                  Держать <em>SLA на 5–10 клиентах</em> одновременно.
                </h3>
                <p className="lead">
                  Большой пул клиентов больше не превращается в хаос. Каждая правка —
                  отслеживаема и обратима.
                </p>
              </div>
              <ul className="core-job-list">
                <li>
                  <div>
                    <b>История версий по каждой странице.</b>
                    <span>
                      Откатываешь любую правку за 1 клик, даже если опубликовал её
                      неделю назад.
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Сравнение «было / стало» перед публикацией.</b>
                    <span>Не пропустишь расхождение с ТЗ клиента.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Все клиентские страницы — в одном окне.</b>
                    <span>Не теряешься между десятком Tilda-проектов.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <b>Публикация только после твоего подтверждения.</b>
                    <span>
                      Контроль остаётся у тебя — ничего не уезжает на прод втихую.
                    </span>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ARRIVAL */}
      <section className="arrival reveal">
        <div className="container">
          <div className="section-num">05 / к чему вы придёте</div>
          <h2 className="section-title">
            Точка <em>Б.</em>
          </h2>

          <div className="arrival-grid">
            <div>
              <h3>Эмоции</h3>
              <ul>
                <li>
                  <em>Спокойствие</em> — клиентские сайты не ломаются от твоих правок.
                </li>
                <li>
                  <em>Чувство роста</em> — берёшь клиентов, которым раньше отказывал.
                </li>
                <li>
                  Перестаёшь <em>выгорать</em> на типовой кликающей работе.
                </li>
              </ul>
            </div>
            <div>
              <h3>Big Job</h3>
              <ul>
                <li>
                  Масштабируешь практику — <em>без найма</em> и без потери качества.
                </li>
                <li>
                  Зарабатываешь больше, <em>работая столько же.</em>
                </li>
                <li>
                  Перестаёшь упираться в потолок <em>личных часов.</em>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DOUBTS */}
      <section className="reveal">
        <div className="container">
          <div className="section-num">06 / есть сомнения?</div>
          <h2 className="section-title">
            Снимаем <em>барьеры,</em> а не игнорируем.
          </h2>

          <div className="doubts">
            <details className="doubt">
              <summary>
                <span className="doubt-q">
                  «AI сломает клиентский сайт перед запуском.»
                </span>
                <span className="doubt-toggle">+</span>
              </summary>
              <p className="doubt-a">
                Правки идут на тестовую страницу. Ты видишь превью и сравнение «было /
                стало» до публикации. Если что-то пошло не так — откат за 1 клик через
                историю версий. Ничего не уезжает на боевой сайт без твоего
                подтверждения.
              </p>
            </details>

            <details className="doubt">
              <summary>
                <span className="doubt-q">
                  «Tilda заблокирует аккаунт моего клиента за автоматизацию.»
                </span>
                <span className="doubt-toggle">+</span>
              </summary>
              <p className="doubt-a">
                Работаем через ссылку на опубликованную страницу — без вмешательства в
                учётку клиента. ToS не нарушаем. Аккаунт клиента остаётся в
                безопасности.
              </p>
            </details>

            <details className="doubt">
              <summary>
                <span className="doubt-q">
                  «AI поймёт неправильно и сделает не то.»
                </span>
                <span className="doubt-toggle">+</span>
              </summary>
              <p className="doubt-a">
                Продукт честно говорит «не понял, уточни — нашёл 3 блока с ценой,
                какой именно?». Никаких best-guess вслепую. Ты сохраняешь контроль над
                каждым шагом — и ничего не публикуется, пока AI не уверен в
                результате.
              </p>
            </details>

            <details className="doubt">
              <summary>
                <span className="doubt-q">
                  «Это будет работать только на простых правках.»
                </span>
                <span className="doubt-toggle">+</span>
              </summary>
              <p className="doubt-a">
                MVP сфокусирован именно на самом массовом: цены, даты, картинки. То,
                что у тебя в потоке каждый день. Сложную перевёрстку ты и руками не
                любишь делать — а 80% типовой работы мы закрываем уже сейчас.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* COMPETITORS */}
      <section className="competitors reveal">
        <div className="container">
          <div className="section-num">07 / увольняем конкурентов</div>
          <h2 className="section-title">
            Что <em>уходит</em> из твоего рабочего дня.
          </h2>

          <div className="comp-list">
            <div className="comp">
              <div className="comp-name">Ручная работа в редакторе Tilda</div>
              <div className="comp-why">
                Вместо 3 часов кликов по Zero Block ты пишешь одну фразу и через
                минуту получаешь превью. Стандартный пакет правок клиента закрываешь
                за 30 минут.
              </div>
              <div className="comp-stamp">fired</div>
            </div>
            <div className="comp">
              <div className="comp-name">Делегирование джуну</div>
              <div className="comp-why">
                Не платишь зарплату. Не объясняешь по 5 раз. Не контролируешь
                качество. И не остаёшься без рук, когда джун ушёл в отпуск перед
                запуском клиентской кампании.
              </div>
              <div className="comp-stamp">fired</div>
            </div>
            <div className="comp">
              <div className="comp-name">Плагины и скрипт-помощники</div>
              <div className="comp-why">
                Они не понимают контекст («какая цена для какой страны у какого
                оператора»). А наш продукт спрашивает уточнение и не публикует, пока
                не уверен в результате.
              </div>
              <div className="comp-stamp">fired</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final reveal" id="cta">
        <div className="container">
          <p>↓ финальный шаг</p>
          <h2 className="final-title">
            Попробуй <em>на своей странице.</em>
            <br />
            Это <em>бесплатно.</em>
          </h2>
          <Link href="/app" className="cta-final">
            Подключить страницу
            <span className="arrow-final">↗</span>
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="foot">
            <div>tildra · 2026</div>
            <div>made for tilda freelancers · with care</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
