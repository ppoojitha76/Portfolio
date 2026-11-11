
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero typing animation
  const typingElement = $('#typing-text');

  if (typingElement && !reduceMotion) {
    const roles = [
      'Data Analyst',
      'SQL Developer',
      'Power BI Developer',
      'Python Analyst'
    ];

    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = false;

    const typeNext = () => {
      const role = roles[roleIndex];

      characterIndex += deleting ? -1 : 1;
      typingElement.textContent = role.slice(0, characterIndex);

      let delay = deleting ? 48 : 92;

      if (!deleting && characterIndex >= role.length) {
        deleting = true;
        delay = 1350;
      } else if (deleting && characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }

      window.setTimeout(typeNext, delay);
    };

    window.setTimeout(typeNext, 1100);
  }

  // Footer year
  const year = $('#year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const siteNav = $('#siteNav');

  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('open');
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Open navigation' : 'Close navigation'
      );

      siteNav.classList.toggle('open', !isOpen);
    });

    $$('.nav-link', siteNav).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', event => {
      if (
        !siteNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) closeMenu();
    });
  }

  // Highlight the section currently in view
  const navLinks = $$('.nav-link');
  const sections = $$('main section[id]');

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          const active =
            link.getAttribute('href') === `#${entry.target.id}`;

          link.classList.toggle('active', active);
        });
      });
    }, {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // Reveal sections as they enter the viewport
  const revealItems = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => {
      item.classList.add('visible');
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  }

  // Certificate preview dialog
  const pdfDialog = $('#pdfDialog');
  const pdfFrame = $('#pdfFrame');
  const pdfTitle = $('#pdfTitle');
  const pdfDownload = $('#pdfDownload');
  const pdfClose = $('#pdfClose');

  $$('.view-certificate').forEach(button => {
    button.addEventListener('click', () => {
      const file = button.dataset.pdf;

      if (!file || !pdfDialog || !pdfFrame) return;

      const url = encodeURI(file);

      if (pdfTitle) {
        pdfTitle.textContent = button.dataset.title || 'Certificate';
      }

      pdfFrame.src = url;

      if (pdfDownload) {
        pdfDownload.href = url;
      }

      if (typeof pdfDialog.showModal === 'function') {
        pdfDialog.showModal();
      } else {
        window.open(url, '_blank', 'noopener');
      }
    });
  });

  const closePdf = () => {
    if (!pdfDialog) return;

    pdfDialog.close();

    if (pdfFrame) {
      pdfFrame.src = 'about:blank';
    }
  };

  if (pdfClose) {
    pdfClose.addEventListener('click', closePdf);
  }

  if (pdfDialog) {
    pdfDialog.addEventListener('click', event => {
      if (event.target === pdfDialog) {
        closePdf();
      }
    });

    pdfDialog.addEventListener('close', () => {
      if (pdfFrame) {
        pdfFrame.src = 'about:blank';
      }
    });
  }

  // Contact form validation
  const contactForm = $('#contactForm');

  if (contactForm) {
    const fields = ['name', 'email', 'subject', 'message'];

    const setError = (field, message) => {
      const error = $(`#error-${field}`);
      const input = $(`#${field}`);

      if (error) {
        error.textContent = message;
      }

      if (input) {
        input.setAttribute(
          'aria-invalid',
          message ? 'true' : 'false'
        );
      }
    };

    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const values = Object.fromEntries(
        new FormData(contactForm).entries()
      );

      let valid = true;

      fields.forEach(field => {
        const value = String(values[field] || '').trim();

        let message = '';

        if (!value) {
          message = 'This field is required.';
        } else if (
          field === 'email' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          message = 'Enter a valid email address.';
        }

        setError(field, message);

        if (message) {
          valid = false;
        }
      });

      if (!valid) return;

      const subject = encodeURIComponent(
        values.subject.trim()
      );

      const body = encodeURIComponent(
        `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`
      );

      const status = $('#formStatus');

      if (status) {
        status.textContent =
          'Your email application should open with the message prepared.';
      }

      window.location.href =
        `mailto:ppoojitha76@gmail.com?subject=${subject}&body=${body}`;
    });

    fields.forEach(field => {
      const input = $(`#${field}`);

      if (input) {
        input.addEventListener('input', () => {
          setError(field, '');
        });
      }
    });
  }

  // Animated background canvas
  // This animation is independent of the reduced-motion preference.
  const canvas = $('#bg');
  const context =
    canvas && canvas.getContext
      ? canvas.getContext('2d')
      : null;

  if (canvas && context) {
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationId = 0;

    let nodes = [];
    let particles = [];

    const pointer = {
      x: -1000,
      y: -1000
    };

    const createScene = () => {
      pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        1.7
      );

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      const nodeCount = Math.max(
        24,
        Math.min(68, Math.floor(width * height / 18000))
      );

      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 1.5 + 0.7,
        phase: Math.random() * Math.PI * 2
      }));

      const particleCount = Math.max(
        14,
        Math.min(36, Math.floor(width / 42))
      );

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 0.35 + 0.18,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.15
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      // Background grid
      context.beginPath();
      context.strokeStyle = 'rgba(113, 190, 157, 0.045)';
      context.lineWidth = 1;

      const grid = 58;

      for (let x = 0; x < width; x += grid) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }

      for (let y = 0; y < height; y += grid) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }

      context.stroke();

      // Moving data points and connecting lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;
        node.phase += 0.012;

        if (node.x < -10 || node.x > width + 10) {
          node.vx *= -1;
        }

        if (node.y < -10 || node.y > height + 10) {
          node.vy *= -1;
        }

        const mouseDistance = Math.hypot(
          node.x - pointer.x,
          node.y - pointer.y
        );

        if (mouseDistance < 125) {
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(pointer.x, pointer.y);

          context.strokeStyle =
            `rgba(98, 230, 181, ${0.18 * (1 - mouseDistance / 125)})`;

          context.lineWidth = 1;
          context.stroke();
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];

          const distance = Math.hypot(
            node.x - other.x,
            node.y - other.y
          );

          if (distance < 145) {
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);

            context.strokeStyle =
              `rgba(98, 230, 181, ${0.14 * (1 - distance / 145)})`;

            context.lineWidth = 0.8;
            context.stroke();
          }
        }

        const pulse =
          0.75 + Math.sin(node.phase) * 0.25;

        context.beginPath();
        context.arc(
          node.x,
          node.y,
          node.radius * pulse,
          0,
          Math.PI * 2
        );

        context.fillStyle = 'rgba(116, 238, 190, 0.62)';
        context.fill();
      }

      // Drifting particles
      particles.forEach(particle => {
        particle.y -= particle.speed;
        particle.x += Math.sin(particle.y * 0.008) * 0.18;

        if (particle.y < -5) {
          particle.y = height + 5;
          particle.x = Math.random() * width;
        }

        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          `rgba(139, 217, 242, ${particle.alpha})`;

        context.fill();
      });

      animationId = window.requestAnimationFrame(draw);
    };

    const handlePointer = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const clearPointer = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    window.addEventListener(
      'pointermove',
      handlePointer,
      { passive: true }
    );

    window.addEventListener(
      'pointerleave',
      clearPointer
    );

    window.addEventListener(
      'resize',
      () => {
        window.cancelAnimationFrame(animationId);
        createScene();
        animationId = window.requestAnimationFrame(draw);
      },
      { passive: true }
    );

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationId);
      } else {
        animationId = window.requestAnimationFrame(draw);
      }
    });

    createScene();
    animationId = window.requestAnimationFrame(draw);
  }
})();


// Browser SQL playground
// Uses SQLite through sql.js, not a remote MySQL server.

(() => {
  const editor = document.getElementById('sqlEditor');
  const runButton = document.getElementById('runSql');
  const resetButton = document.getElementById('resetSql');
  const output = document.getElementById('sqlOutput');
  const status = document.getElementById('sqlEngineStatus');
  const resultMeta = document.getElementById('sqlResultMeta');

  if (!editor || !runButton || !output) return;

  const starterQuery = `SELECT
    region,
    COUNT(*) AS total_orders,
    ROUND(SUM(amount), 2) AS total_sales
FROM sales
GROUP BY region
ORDER BY total_sales DESC;`;

  let database = null;
  let engineReady = false;

  const showMessage = (message, type = 'empty') => {
    output.replaceChildren();

    const box = document.createElement('div');

    box.className =
      type === 'error' ? 'sql-error' : 'sql-empty';

    box.textContent = message;
    output.appendChild(box);
  };

  const renderResults = results => {
    output.replaceChildren();

    if (!results || results.length === 0) {
      const message = document.createElement('div');

      message.className = 'sql-success';
      message.textContent =
        'Query executed successfully. No rows were returned.';

      output.appendChild(message);

      if (resultMeta) {
        resultMeta.textContent = 'Statement completed';
      }

      return;
    }

    const result = results[results.length - 1];

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    result.columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    result.values.forEach(row => {
      const tr = document.createElement('tr');

      row.forEach(value => {
        const td = document.createElement('td');

        td.textContent =
          value === null ? 'NULL' : String(value);

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    output.appendChild(table);

    if (resultMeta) {
      resultMeta.textContent =
        `${result.values.length} row(s) returned`;
    }
  };

  const runQuery = () => {
    if (!engineReady || !database) {
      showMessage(
        'The SQL engine is still loading. Please wait a moment.'
      );
      return;
    }

    const query = editor.value.trim();

    if (!query) {
      showMessage('Write a SQL query before running it.');
      return;
    }

    try {
      const results = database.exec(query);
      renderResults(results);
    } catch (error) {
      showMessage(
        error.message || 'Unable to execute this SQL query.',
        'error'
      );

      if (resultMeta) {
        resultMeta.textContent = 'Query error';
      }
    }
  };

  runButton.addEventListener('click', runQuery);

  editor.addEventListener('keydown', event => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === 'Enter'
    ) {
      event.preventDefault();
      runQuery();
    }

    if (event.key === 'Tab') {
      event.preventDefault();

      const start = editor.selectionStart;
      const end = editor.selectionEnd;

      editor.setRangeText(
        '    ',
        start,
        end,
        'end'
      );
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      editor.value = starterQuery;

      if (engineReady) {
        runQuery();
      } else {
        showMessage(
          'The example query has been restored. SQL engine is loading.'
        );
      }
    });
  }

  const initialiseDatabase = async () => {
    if (typeof window.initSqlJs !== 'function') {
      if (status) {
        status.textContent =
          'SQL engine unavailable. Check your internet connection.';
      }

      showMessage(
        'Could not load the SQL engine. Connect to the internet and refresh the page.',
        'error'
      );

      runButton.disabled = true;
      return;
    }

    try {
      const SQL = await window.initSqlJs({
        locateFile: file =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
      });

      database = new SQL.Database();

      database.run(`
        CREATE TABLE sales (
          order_id INTEGER PRIMARY KEY,
          customer TEXT NOT NULL,
          region TEXT NOT NULL,
          category TEXT NOT NULL,
          amount REAL NOT NULL
        );

        INSERT INTO sales (customer, region, category, amount) VALUES
          ('Aarav', 'South', 'Electronics', 12500),
          ('Diya', 'North', 'Furniture', 8400),
          ('Ishaan', 'West', 'Electronics', 15900),
          ('Meera', 'South', 'Clothing', 3200),
          ('Kabir', 'East', 'Furniture', 6700),
          ('Anaya', 'West', 'Clothing', 4100),
          ('Vihaan', 'South', 'Furniture', 9800),
          ('Saanvi', 'North', 'Electronics', 14200),
          ('Arjun', 'East', 'Clothing', 2900),
          ('Tara', 'West', 'Furniture', 7600),
          ('Rohan', 'South', 'Electronics', 11300),
          ('Nila', 'North', 'Clothing', 5200);
      `);

      engineReady = true;

      if (status) {
        status.textContent =
          'SQL engine ready · 12 sample sales records loaded';
      }

      runButton.disabled = false;
      runQuery();

    } catch (error) {
      if (status) {
        status.textContent = 'Could not start SQL engine';
      }

      showMessage(
        error.message || 'SQL engine initialisation failed.',
        'error'
      );

      runButton.disabled = true;
    }
  };

  runButton.disabled = true;
  initialiseDatabase();
})();
s