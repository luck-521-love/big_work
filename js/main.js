/**
 * SpongeBob Fan Site — 全局交互脚本
 * 功能：返回顶部 | 每日一言 | 灯箱 | 留言板 | 剧集搜索 | 点赞
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. 返回顶部按钮
     ========================================================== */
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', '返回顶部');
  backToTopBtn.innerHTML = '<i class="bi bi-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(backToTopBtn);

  const handleScroll = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================
     2. 每日一言模块
     ========================================================== */
  const quotes = [
    { text: '我准备好了！我准备好了！我准备好了！', from: '— 海绵宝宝' },
    { text: '知识永远比金钱重要。', from: '— 海绵宝宝' },
    { text: '当世界看你的时候，你也在看世界。', from: '— 海绵宝宝' },
    { text: '最好的朋友，就是跟你一起做傻事的那个人。', from: '— 海绵宝宝' },
    { text: '派大星，你是我最好的朋友！', from: '— 海绵宝宝' },
    { text: '今天也是美好的一天呢！', from: '— 海绵宝宝' },
    { text: '没有人能阻挡我展现笑容。', from: '— 海绵宝宝' },
    { text: '生活就像吹泡泡，到处都充满了奇迹。', from: '— 海绵宝宝' },
    { text: '只要不放弃，梦想就能实现。', from: '— 海绵宝宝' },
    { text: '就算住在菠萝里，我也很快乐！', from: '— 海绵宝宝' },
  ];

  const quoteTextEl = document.getElementById('quoteText');
  const quoteFromEl = document.getElementById('quoteFrom');
  const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');

  if (quoteTextEl && quoteFromEl && refreshQuoteBtn) {
    let lastIndex = -1;

    const showRandomQuote = () => {
      let index;
      do {
        index = Math.floor(Math.random() * quotes.length);
      } while (index === lastIndex && quotes.length > 1);
      lastIndex = index;

      const quote = quotes[index];
      quoteTextEl.style.opacity = '0';
      quoteFromEl.style.opacity = '0';

      setTimeout(() => {
        quoteTextEl.textContent = quote.text;
        quoteFromEl.textContent = quote.from;
        quoteTextEl.style.opacity = '1';
        quoteFromEl.style.opacity = '1';
      }, 200);
    };

    refreshQuoteBtn.addEventListener('click', showRandomQuote);

    // 初始显示（如果还没有内容）
    if (!quoteTextEl.textContent.trim()) {
      showRandomQuote();
    }
  }

  /* ==========================================================
     3. 图片灯箱
     ========================================================== */
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-overlay';
  lightboxOverlay.setAttribute('aria-hidden', 'true');
  lightboxOverlay.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="关闭灯箱">&times;</button>
      <img src="" alt="" id="lightboxImage">
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  const lightboxImg = document.getElementById('lightboxImage');
  const closeBtn = lightboxOverlay.querySelector('.lightbox-close');

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxOverlay.classList.add('active');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 绑定图库卡片
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.lightbox;
      const alt = el.dataset.lightboxAlt || '';
      openLightbox(src, alt);
    });
  });

  // 也支持点击 .gallery-card 中的图片
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', function (e) {
      if (e.target.closest('[data-lightbox]')) return;
      const img = this.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });

  /* ==========================================================
     4. 留言板 — 表单提交模拟
     ========================================================== */
  const contactForm = document.getElementById('contactForm');
  const messageList = document.getElementById('messageList');
  const emptyMessage = document.getElementById('emptyMessage');

  if (contactForm && messageList) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('floatingName');
      const msgInput = document.getElementById('floatingMessage');
      const name = nameInput.value.trim();
      const msg = msgInput.value.trim();

      if (!name || !msg) return;

      const now = new Date();
      const timeStr = now.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.style.opacity = '0';
      li.style.transform = 'translateY(-10px)';
      li.style.transition = 'all 0.3s ease-out';
      li.innerHTML = `
        <div class="d-flex gap-3 align-items-start">
          <img src="https://placehold.co/48x48/${name === '海绵宝宝' ? 'FFD700' : '1A759F'}/fff?text=${encodeURIComponent(name.charAt(0))}"
               alt="${name} 的头像" class="rounded-circle flex-shrink-0" width="48" height="48"
               style="border: 2px solid var(--border-soft);">
          <div>
            <div class="fw-bold" style="color:var(--ocean-blue);">${escapeHTML(name)}</div>
            <p class="mb-1" style="color:var(--text-secondary);">${escapeHTML(msg)}</p>
            <small class="text-muted"><i class="bi bi-clock" aria-hidden="true"></i> ${timeStr}</small>
          </div>
        </div>
      `;

      messageList.insertBefore(li, messageList.firstChild);

      requestAnimationFrame(() => {
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      });

      if (emptyMessage) {
        emptyMessage.style.display = 'none';
      }

      contactForm.reset();
      nameInput.focus();
    });
  }

  /* ==========================================================
     5. 剧集分页 + 搜索过滤
     ========================================================== */
  const episodeSearch = document.getElementById('episodeSearch');
  const paginationContainer = document.getElementById('paginationContainer');
  const EPISODES_PER_PAGE = 8;
  const hasBootstrap = typeof bootstrap !== 'undefined';

  if (episodeSearch && paginationContainer) {
    const allEpisodeCards = Array.from(document.querySelectorAll('[data-episode-title]')).map(el => ({
      el: el,
      card: el.closest('.card') || el.closest('.episode-card') || el.querySelector('.card') || el.querySelector('.episode-card') || el,
      panel: el.closest('.accordion-collapse'),
      panelItem: el.closest('.accordion-item'),
      title: (el.dataset.episodeTitle || '').toLowerCase(),
    }));

    let currentPage = 1;
    let isSearching = false;
    const totalPages = Math.ceil(allEpisodeCards.length / EPISODES_PER_PAGE);

    /* 安全折叠面板操作 */
    const safeCollapseToggle = (collapse, action) => {
      if (!hasBootstrap) {
        if (action === 'show') collapse.classList.add('show');
        else collapse.classList.remove('show');
        return;
      }
      const bsCollapse = bootstrap.Collapse.getInstance(collapse);
      if (!bsCollapse) {
        if (action === 'show') collapse.classList.add('show');
        else collapse.classList.remove('show');
        return;
      }
      if (action === 'show') bsCollapse.show();
      else bsCollapse.hide();
    };

    /* 更新折叠面板可见性 */
    const updateAccordionVisibility = () => {
      document.querySelectorAll('.accordion-collapse').forEach(collapse => {
        const items = collapse.querySelectorAll('[data-episode-title]');
        let visibleCount = 0;
        items.forEach(el => {
          const parent = el.closest('.card') || el.closest('.episode-card') || el;
          if (parent && parent.style.display !== 'none') visibleCount++;
        });
        const accordionItem = collapse.closest('.accordion-item');
        if (accordionItem) {
          accordionItem.style.display = visibleCount === 0 ? 'none' : '';
        }
      });
    };

    /* 显示指定页 */
    const showPage = (page) => {
      currentPage = Math.max(1, Math.min(page, totalPages));
      isSearching = false;
      if (episodeSearch) episodeSearch.value = '';

      const start = (currentPage - 1) * EPISODES_PER_PAGE;
      const end = start + EPISODES_PER_PAGE;

      const currentSet = new Set(allEpisodeCards.slice(start, end));

      allEpisodeCards.forEach(item => {
        if (item.card) {
          item.card.style.display = currentSet.has(item) ? '' : 'none';
        }
      });

      updateAccordionVisibility();

      // 展开相关面板，收起其余
      const visiblePanelIds = new Set();
      allEpisodeCards.slice(start, end).forEach(item => {
        if (item.panel) visiblePanelIds.add(item.panel.id);
      });

      document.querySelectorAll('.accordion-collapse').forEach(collapse => {
        if (collapse.closest('.accordion-item').style.display === 'none') return;
        safeCollapseToggle(collapse, visiblePanelIds.has(collapse.id) ? 'show' : 'hide');
      });

      renderPagination();
    };

    /* 搜索 */
    const doSearch = (query) => {
      if (!query) { showPage(1); return; }
      isSearching = true;

      allEpisodeCards.forEach(item => {
        if (item.card) item.card.style.display = item.title.includes(query) ? '' : 'none';
      });

      updateAccordionVisibility();

      document.querySelectorAll('.accordion-collapse').forEach(collapse => {
        if (collapse.closest('.accordion-item').style.display === 'none') return;
        let matchedCount = 0;
        collapse.querySelectorAll('[data-episode-title]').forEach(el => {
          const p = el.closest('.card') || el.closest('.episode-card') || el;
          if (p && p.style.display !== 'none') matchedCount++;
        });
        safeCollapseToggle(collapse, matchedCount > 0 ? 'show' : 'hide');
      });

      paginationContainer.innerHTML = '';
    };

    /* 渲染分页 UI */
    const renderPagination = () => {
      const infoEl = document.getElementById('paginationInfo');
      if (infoEl) {
        const s = (currentPage - 1) * EPISODES_PER_PAGE + 1;
        const e = Math.min(currentPage * EPISODES_PER_PAGE, allEpisodeCards.length);
        infoEl.textContent = `第 ${s}-${e} 集 / 共 ${allEpisodeCards.length} 集`;
      }

      if (totalPages <= 1) { paginationContainer.innerHTML = ''; return; }

      let html = '<ul class="pagination justify-content-center">';
      html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="上一页"><i class="bi bi-chevron-left" aria-hidden="true"></i> 上一页</a></li>`;

      const pageBtn = (p, label) => {
        const isActive = p === currentPage;
        return `<li class="page-item${isActive ? ' active' : ''}"><a class="page-link" href="#" data-page="${p}"${isActive ? ' aria-current="page"' : ''}>${label}</a></li>`;
      };

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) html += pageBtn(i, String(i));
      } else {
        html += pageBtn(1, '1');
        if (currentPage > 3) html += '<li class="page-item disabled"><span class="page-link">&hellip;</span></li>';
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) html += pageBtn(i, String(i));
        if (currentPage < totalPages - 2) html += '<li class="page-item disabled"><span class="page-link">&hellip;</span></li>';
        html += pageBtn(totalPages, String(totalPages));
      }

      html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="下一页">下一页 <i class="bi bi-chevron-right" aria-hidden="true"></i></a></li>`;
      html += '</ul>';
      paginationContainer.innerHTML = html;

      paginationContainer.querySelectorAll('.page-link[data-page]').forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const p = parseInt(this.dataset.page, 10);
          if (p >= 1 && p <= totalPages && !isSearching) {
            showPage(p);
            const acc = document.getElementById('seasonsAccordion');
            if (acc) acc.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    };

    episodeSearch.addEventListener('input', function () {
      doSearch(this.value.toLowerCase().trim());
    });

    // 初始化 — 默认显示全部，让页面上先有内容
    showPage(1);
  }

  /* ==========================================================
     6. 图库分类筛选
     ========================================================== */
  const galleryFilter = document.getElementById('galleryFilter');
  const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');

  if (galleryFilterBtns.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // 更新按钮状态
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.galleryFilter;
        document.querySelectorAll('[data-gallery-category]').forEach(item => {
          if (filter === 'all' || item.dataset.galleryCategory === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================
     7. 点赞计数
     ========================================================== */
  document.querySelectorAll('[data-like-btn]').forEach(btn => {
    btn.addEventListener('click', function () {
      const counter = this.querySelector('[data-like-count]');
      if (counter) {
        let count = parseInt(counter.textContent, 10) || 0;
        count += 1;
        counter.textContent = count;

        // 小动画
        this.style.transform = 'scale(1.15)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });
});

/**
 * HTML 转义工具函数
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
