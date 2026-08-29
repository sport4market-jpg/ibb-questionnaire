(function () {
  "use strict";

  var DATA = window.QUESTIONNAIRE_DATA;
  var STORAGE_KEY = "ibb-questionnaire-v1";
  var allQuestions = [];
  var questionMeta = {};
  var firstIndexBySection = {};
  var state;
  var saveTimer = null;
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/saxon@ukr.net";

  DATA.sections.forEach(function (section, sectionIndex) {
    firstIndexBySection[section.id] = allQuestions.length;
    section.questions.forEach(function (question, localIndex) {
      questionMeta[question.id] = {
        section: section,
        sectionIndex: sectionIndex,
        localIndex: localIndex,
        question: question,
        globalIndex: allQuestions.length
      };
      allQuestions.push(question);
    });
  });

  state = loadState();

  var dom = {
    startScreen: byId("start-screen"),
    surveyShell: byId("survey-shell"),
    finalScreen: byId("final-screen"),
    questionCard: byId("question-card"),
    sectionNav: byId("section-nav"),
    mobileNav: byId("mobile-section-nav"),
    progressLabel: byId("progress-label"),
    progressPercent: byId("progress-percent"),
    progressTrack: byId("progress-track"),
    progressFill: byId("progress-fill"),
    saveStatus: byId("save-status"),
    contactName: byId("contact-name"),
    contactEmail: byId("contact-email"),
    filledCount: byId("filled-count"),
    emptyCount: byId("empty-count"),
    sendStatus: byId("send-status"),
    sendStatusIcon: byId("send-status-icon"),
    sendStatusText: byId("send-status-text"),
    clearButton: byId("clear-button"),
    submitButton: byId("submit-button")
  };

  initialiseStaticContent();
  bindStaticEvents();
  showStart();

  function byId(id) { return document.getElementById(id); }

  function make(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function emptyState() {
    return {
      version: 1,
      current: 0,
      answers: {},
      visited: [],
      contact: { name: "", email: "" },
      started: false,
      sent: false,
      updatedAt: null
    };
  }

  function loadState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!parsed || parsed.version !== 1) return emptyState();
      parsed.answers = parsed.answers || {};
      parsed.visited = Array.isArray(parsed.visited) ? parsed.visited : [];
      parsed.contact = parsed.contact || { name: "", email: "" };
      parsed.current = Math.max(0, Math.min(allQuestions.length - 1, Number(parsed.current) || 0));
      return parsed;
    } catch (error) {
      return emptyState();
    }
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      dom.saveStatus.classList.remove("is-error");
      clearTimeout(saveTimer);
      dom.saveStatus.classList.add("is-saving");
      saveTimer = setTimeout(function () { dom.saveStatus.classList.remove("is-saving"); }, 450);
    } catch (error) {
      dom.saveStatus.classList.add("is-error");
      byId("save-label").textContent = "Не удалось сохранить локально";
    }
  }

  function initialiseStaticContent() {
    byId("start-eyebrow").textContent = DATA.ui.eyebrow;
    byId("start-title").textContent = DATA.ui.title;
    byId("start-description").textContent = DATA.ui.description;
    byId("survey-facts").textContent = DATA.ui.facts;
    byId("basis-title").textContent = DATA.ui.basisTitle;
    byId("final-title").textContent = DATA.ui.finalTitle;
    byId("final-text").textContent = DATA.ui.finalText;
    byId("year").textContent = new Date().getFullYear();

    var basisList = byId("basis-list");
    DATA.basis.forEach(function (item) { basisList.appendChild(make("li", "", item)); });

    var route = byId("start-route");
    DATA.sections.forEach(function (section, index) {
      var node = make("span", "route-node");
      node.style.setProperty("--node-color", section.color);
      node.style.setProperty("--i", index);
      route.appendChild(node);
    });

    renderNavigation();
  }

  function bindStaticEvents() {
    document.querySelector("[data-action='home']").addEventListener("click", function (event) {
      event.preventDefault();
      showStart();
    });

    byId("return-button").addEventListener("click", function () {
      state.current = allQuestions.length - 1;
      saveState();
      showSurvey();
    });

    byId("download-button").addEventListener("click", downloadAnswers);
    dom.submitButton.addEventListener("click", submitAnswers);
    dom.clearButton.addEventListener("click", clearSavedAnswers);

    dom.contactName.addEventListener("input", updateContact);
    dom.contactEmail.addEventListener("input", updateContact);

    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        state = loadState();
        if (!dom.surveyShell.hidden) renderQuestion();
      }
    });
  }

  function hasSavedProgress() {
    return Boolean(state.started || Object.keys(state.answers).length || state.contact.name || state.contact.email);
  }

  function showStart() {
    dom.startScreen.hidden = false;
    dom.surveyShell.hidden = true;
    dom.finalScreen.hidden = true;
    document.body.style.removeProperty("--accent");
    renderStartActions();
    window.scrollTo(0, 0);
    document.title = "Предварительный опросник — Idstein bleibt bunt";
  }

  function renderStartActions() {
    var actions = byId("start-actions");
    actions.replaceChildren();

    if (hasSavedProgress()) {
      var resume = make("button", "button button-primary", DATA.ui.resume);
      resume.type = "button";
      resume.addEventListener("click", showSurvey);
      actions.appendChild(resume);

      var restart = make("button", "button button-tertiary", DATA.ui.restart);
      restart.type = "button";
      restart.addEventListener("click", function () {
        if (!window.confirm("Начать заново? Сохранённые на этом устройстве ответы будут удалены.")) return;
        state = emptyState();
        localStorage.removeItem(STORAGE_KEY);
        startNew();
      });
      actions.appendChild(restart);
    } else {
      var start = make("button", "button button-primary", DATA.ui.start);
      start.type = "button";
      start.addEventListener("click", startNew);
      actions.appendChild(start);
    }
  }

  function startNew() {
    state.started = true;
    state.current = 0;
    saveState();
    showSurvey();
  }

  function showSurvey() {
    state.started = true;
    dom.startScreen.hidden = true;
    dom.finalScreen.hidden = true;
    dom.surveyShell.hidden = false;
    renderQuestion();
  }

  function showFinal() {
    dom.startScreen.hidden = true;
    dom.surveyShell.hidden = true;
    dom.finalScreen.hidden = false;
    dom.contactName.value = state.contact.name || "";
    dom.contactEmail.value = state.contact.email || "";
    if (state.sent) setSendStatus("success", DATA.ui.sent);
    else dom.sendStatus.hidden = true;
    updateSummary();
    window.scrollTo(0, 0);
    document.title = "Ответы готовы — Idstein bleibt bunt";
    requestAnimationFrame(function () { byId("final-title").focus({ preventScroll: true }); });
  }

  function renderNavigation() {
    var desktopList = make("ol", "section-nav-list");
    DATA.sections.forEach(function (section, index) {
      var item = make("li");
      var button = make("button", "section-nav-button");
      button.type = "button";
      button.dataset.sectionId = section.id;
      button.style.setProperty("--section-color", section.color);
      button.appendChild(make("span", "section-nav-number", String(index + 1).padStart(2, "0")));
      button.appendChild(make("span", "", section.short));
      var check = make("span", "section-nav-check", "✓");
      check.setAttribute("aria-hidden", "true");
      button.appendChild(check);
      button.addEventListener("click", function () { goToQuestion(firstIndexBySection[section.id]); });
      item.appendChild(button);
      desktopList.appendChild(item);

      var chip = make("button", "mobile-section-button", (index + 1) + ". " + section.short);
      chip.type = "button";
      chip.dataset.sectionId = section.id;
      chip.style.setProperty("--section-color", section.color);
      chip.addEventListener("click", function () { goToQuestion(firstIndexBySection[section.id]); });
      dom.mobileNav.appendChild(chip);
    });
    dom.sectionNav.appendChild(desktopList);
  }

  function updateNavigation(activeSection) {
    var visited = new Set(state.visited);
    DATA.sections.forEach(function (section) {
      var isComplete = section.questions.every(function (question) { return visited.has(question.id); });
      document.querySelectorAll("[data-section-id='" + section.id + "']").forEach(function (button) {
        button.classList.toggle("is-active", section.id === activeSection.id);
        button.classList.toggle("is-complete", isComplete);
        if (section.id === activeSection.id) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
    });

    var activeChip = dom.mobileNav.querySelector(".is-active");
    if (activeChip && window.innerWidth <= 760) {
      activeChip.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest", inline: "center" });
    }
  }

  function renderQuestion() {
    var question = allQuestions[state.current];
    var meta = questionMeta[question.id];
    var section = meta.section;
    var answer = normaliseAnswer(question, state.answers[question.id]);
    state.answers[question.id] = answer;

    if (state.visited.indexOf(question.id) === -1) state.visited.push(question.id);
    saveState();

    document.body.style.setProperty("--accent", section.color);
    document.title = question.id + " — " + section.title + " — Idstein bleibt bunt";

    var number = state.current + 1;
    var percent = Math.round((number / allQuestions.length) * 100);
    dom.progressLabel.textContent = "Раздел " + (meta.sectionIndex + 1) + " из " + DATA.sections.length + " · Вопрос " + number + " из " + allQuestions.length;
    dom.progressPercent.textContent = percent + "%";
    dom.progressTrack.setAttribute("aria-valuenow", percent);
    dom.progressFill.style.width = percent + "%";

    updateNavigation(section);
    dom.questionCard.replaceChildren();
    dom.questionCard.classList.remove("is-entering");
    void dom.questionCard.offsetWidth;
    dom.questionCard.classList.add("is-entering");

    dom.questionCard.appendChild(make("p", "question-section-label", (meta.sectionIndex + 1) + " / " + DATA.sections.length + " · " + section.title));
    if (meta.localIndex === 0 && section.intro) dom.questionCard.appendChild(make("p", "question-intro", section.intro));

    var title = make("h1", "", question.title);
    title.id = "question-title";
    title.tabIndex = -1;
    dom.questionCard.appendChild(title);

    if (question.hint) dom.questionCard.appendChild(make("p", "question-hint", question.hint));
    if (question.note) dom.questionCard.appendChild(make("p", "question-note", question.note));
    if (question.flow) dom.questionCard.appendChild(renderFlow(question.flow));
    if (question.timeline) dom.questionCard.appendChild(renderTimeline(question.timeline));
    if (question.stages) dom.questionCard.appendChild(renderStages(question.stages));

    if (question.type === "textarea") renderTextarea(question, answer);
    else renderOptions(question, answer);

    dom.questionCard.appendChild(renderQuestionActions());
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { title.focus({ preventScroll: true }); });
  }

  function normaliseAnswer(question, answer) {
    if (answer && typeof answer === "object") return answer;
    return question.type === "checkbox" ? { value: [], extra: "" } : { value: "", extra: "" };
  }

  function renderTextarea(question, answer) {
    var label = make("label", "");
    label.setAttribute("for", "answer-" + question.id);
    label.appendChild(make("span", "sr-only", question.title));
    var textarea = make("textarea", "text-answer");
    textarea.id = "answer-" + question.id;
    textarea.value = answer.value || "";
    textarea.placeholder = question.hint || "Введите ваш ответ…";
    textarea.addEventListener("input", function () {
      answer.value = textarea.value;
      state.answers[question.id] = answer;
      saveState();
    });
    label.appendChild(textarea);
    dom.questionCard.appendChild(label);
    if (question.optional) dom.questionCard.appendChild(make("span", "optional-label", DATA.ui.optional));
  }

  function renderOptions(question, answer) {
    var guide = make("div", "selection-guide");
    var instruction = question.type === "radio" ? DATA.ui.one : (question.max ? DATA.ui.max3 : DATA.ui.many);
    guide.appendChild(make("span", "", instruction));
    var counter = null;
    if (question.max) {
      counter = make("span", "selection-counter", DATA.ui.counter(answer.value.length, question.max));
      guide.appendChild(counter);
    }
    dom.questionCard.appendChild(guide);

    var options = make("div", "options");
    options.setAttribute("role", question.type === "radio" ? "radiogroup" : "group");
    options.setAttribute("aria-labelledby", "question-title");

    question.options.forEach(function (option, index) {
      var label = make("label", "option-card");
      var input = document.createElement("input");
      input.type = question.type;
      input.name = "answer-" + question.id;
      input.value = option;
      input.id = "answer-" + question.id + "-" + index;
      input.checked = question.type === "checkbox" ? answer.value.indexOf(option) !== -1 : answer.value === option;
      label.classList.toggle("is-checked", input.checked);
      label.appendChild(input);
      label.appendChild(make("span", "", option));
      options.appendChild(label);

      input.addEventListener("change", function () {
        if (question.type === "checkbox") {
          if (input.checked && answer.value.indexOf(option) === -1) answer.value.push(option);
          if (!input.checked) answer.value = answer.value.filter(function (value) { return value !== option; });
        } else {
          answer.value = option;
        }
        state.answers[question.id] = answer;
        refreshOptionState(options, question, answer, counter);
        refreshConditional(question, answer);
        saveState();
      });
    });

    dom.questionCard.appendChild(options);
    refreshOptionState(options, question, answer, counter);

    if (question.conditional) {
      var conditional = make("div", "conditional-wrap");
      conditional.id = "conditional-" + question.id;
      var inner = make("div", "conditional-inner");
      var conditionalLabel = make("label", "conditional-label", question.conditional.label);
      conditionalLabel.setAttribute("for", "extra-" + question.id);
      var textarea = make("textarea", "conditional-input");
      textarea.id = "extra-" + question.id;
      textarea.value = answer.extra || "";
      textarea.addEventListener("input", function () {
        answer.extra = textarea.value;
        state.answers[question.id] = answer;
        saveState();
      });
      inner.appendChild(conditionalLabel);
      inner.appendChild(textarea);
      conditional.appendChild(inner);
      dom.questionCard.appendChild(conditional);
      refreshConditional(question, answer);
    }
  }

  function refreshOptionState(options, question, answer, counter) {
    var count = question.type === "checkbox" ? answer.value.length : 0;
    var atLimit = Boolean(question.max && count >= question.max);
    options.querySelectorAll("input").forEach(function (input) {
      input.checked = question.type === "checkbox" ? answer.value.indexOf(input.value) !== -1 : answer.value === input.value;
      input.disabled = atLimit && !input.checked;
      input.closest("label").classList.toggle("is-checked", input.checked);
      input.closest("label").classList.toggle("is-disabled", input.disabled);
    });
    if (counter) counter.textContent = DATA.ui.counter(count, question.max);
  }

  function refreshConditional(question, answer) {
    if (!question.conditional) return;
    var conditional = byId("conditional-" + question.id);
    if (!conditional) return;
    var visible = answer.value === question.conditional.when;
    conditional.setAttribute("aria-hidden", visible ? "false" : "true");
    conditional.querySelector("textarea").disabled = !visible;
    if (visible) {
      conditional.hidden = false;
      requestAnimationFrame(function () { conditional.classList.add("is-visible"); });
    } else {
      conditional.classList.remove("is-visible");
      conditional.hidden = true;
    }
  }

  function renderFlow(steps) {
    var flow = make("div", "flow");
    flow.style.setProperty("--columns", steps.length);
    steps.forEach(function (step) { flow.appendChild(make("div", "flow-step", step)); });
    return flow;
  }

  function renderTimeline(steps) {
    var list = make("ol", "timeline");
    steps.forEach(function (step) { list.appendChild(make("li", "", step)); });
    return list;
  }

  function renderStages(stages) {
    var block = make("div", "stages");
    block.style.setProperty("--columns", stages.length);
    stages.forEach(function (stage) {
      var item = make("div", "stage");
      item.appendChild(make("strong", "", stage.label));
      item.appendChild(make("span", "", stage.text));
      block.appendChild(item);
    });
    return block;
  }

  function renderQuestionActions() {
    var actions = make("div", "question-actions");
    var back = make("button", "button button-secondary", DATA.ui.back);
    back.type = "button";
    back.addEventListener("click", function () {
      if (state.current === 0) showStart();
      else goToQuestion(state.current - 1);
    });

    var nextLabel = state.current === allQuestions.length - 1 ? "К итогам →" : DATA.ui.next;
    var next = make("button", "button button-primary", nextLabel);
    next.type = "button";
    next.addEventListener("click", function () {
      if (state.current === allQuestions.length - 1) showFinal();
      else goToQuestion(state.current + 1);
    });

    actions.appendChild(back);
    actions.appendChild(next);
    return actions;
  }

  function goToQuestion(index) {
    state.current = Math.max(0, Math.min(allQuestions.length - 1, index));
    saveState();
    if (dom.surveyShell.hidden) showSurvey();
    else renderQuestion();
  }

  function updateContact() {
    state.contact.name = dom.contactName.value;
    state.contact.email = dom.contactEmail.value;
    saveState();
  }

  function isAnswered(question) {
    var answer = state.answers[question.id];
    if (!answer) return false;
    if (Array.isArray(answer.value)) return answer.value.length > 0;
    return String(answer.value || "").trim().length > 0;
  }

  function updateSummary() {
    var filled = allQuestions.filter(isAnswered).length;
    dom.filledCount.textContent = filled;
    dom.emptyCount.textContent = allQuestions.length - filled;
  }

  function buildMessage() {
    var lines = [
      "Idstein bleibt bunt",
      "Ответы на предварительный опросник",
      "",
      "Имя: " + (state.contact.name.trim() || "Не указано"),
      "E-mail: " + (state.contact.email.trim() || "Не указан"),
      "Дата: " + new Date().toLocaleString("ru-RU"),
      ""
    ];

    DATA.sections.forEach(function (section, sectionIndex) {
      lines.push("=== " + (sectionIndex + 1) + ". " + section.title + " ===", "");
      section.questions.forEach(function (question) {
        var answer = normaliseAnswer(question, state.answers[question.id]);
        lines.push(question.id + " " + question.title);
        if (Array.isArray(answer.value)) {
          if (answer.value.length) answer.value.forEach(function (value) { lines.push("• " + value); });
          else lines.push("Без ответа");
        } else {
          lines.push(String(answer.value || "").trim() || "Без ответа");
        }
        if (question.conditional && answer.value === question.conditional.when && String(answer.extra || "").trim()) {
          lines.push(question.conditional.label + ":", String(answer.extra).trim());
        }
        lines.push("");
      });
      lines.push("");
    });

    return lines.join("\r\n");
  }

  function downloadAnswers() {
    updateContact();
    var blob = new Blob(["\ufeff" + buildMessage()], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "idstein-bleibt-bunt-antworten.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function setSendStatus(type, message) {
    dom.sendStatus.classList.toggle("is-error", type === "error");
    dom.sendStatusIcon.textContent = type === "error" ? "!" : "✓";
    dom.sendStatusText.textContent = message;
    dom.clearButton.hidden = type !== "success";
    dom.sendStatus.hidden = false;
    dom.sendStatus.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest" });
  }

  async function submitAnswers() {
    updateContact();
    dom.sendStatus.hidden = true;
    dom.submitButton.disabled = true;
    dom.submitButton.textContent = DATA.ui.submitting;

    try {
      var response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: state.contact.name.trim() || "Не указано",
          email: state.contact.email.trim() || "Не указан",
          message: buildMessage(),
          _subject: "Новый опросник — Idstein bleibt bunt",
          _template: "box",
          _captcha: "false",
          _honey: "",
          _url: window.location.href
        })
      });

      var result = await response.json().catch(function () { return {}; });
      var accepted = result.success === true || result.success === "true";
      if (!response.ok || !accepted) throw new Error(result.message || "Сервис не принял сообщение");

      state.sent = true;
      saveState();

      if (/activat|confirm|verify/i.test(String(result.message || ""))) {
        setSendStatus("success", "Нужно один раз подтвердить адрес: откройте письмо FormSubmit в saxon@ukr.net и нажмите Activate Form. После подтверждения ответы будут доставлены.");
      } else {
        setSendStatus("success", DATA.ui.sent);
      }
    } catch (error) {
      state.sent = false;
      saveState();
      setSendStatus("error", "Не удалось отправить ответы. Проверьте интернет и попробуйте ещё раз. Сохранённая копия ответов не потеряна.");
      console.error("Questionnaire submission failed:", error);
    } finally {
      dom.submitButton.disabled = false;
      dom.submitButton.textContent = DATA.ui.submit;
    }
  }

  function clearSavedAnswers() {
    if (!window.confirm(DATA.ui.clearConfirm)) return;
    localStorage.removeItem(STORAGE_KEY);
    state = emptyState();
    dom.sendStatus.hidden = true;
    showStart();
  }

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}());
