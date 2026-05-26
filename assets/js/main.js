const setupMenu = () => {
  const btn = document.querySelector("[data-menu-btn]");
  const menu = document.querySelector("[data-menu]");

  if (!btn || !menu) {
    return;
  }

  const setState = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  setState(false);

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    setState(!open);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setState(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (menu.hidden) {
      return;
    }

    if (!menu.contains(event.target) && !btn.contains(event.target)) {
      setState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) {
      setState(false);
    }
  });
};

const setupScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") {
        return;
      }

      const target = document.querySelector(id);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", id);
    });
  });
};

const setupFaq = () => {
  document.querySelectorAll("[data-faq]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-faq-btn]");

    const closeItem = (btn) => {
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      btn.setAttribute("aria-expanded", "false");

      if (panel) {
        panel.hidden = true;
      }
    };

    const openItem = (btn) => {
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      btn.setAttribute("aria-expanded", "true");

      if (panel) {
        panel.hidden = false;
      }
    };

    buttons.forEach((btn) => {
      const open = btn.getAttribute("aria-expanded") === "true";

      if (open) {
        openItem(btn);
      } else {
        closeItem(btn);
      }

      btn.addEventListener("click", () => {
        const openNow = btn.getAttribute("aria-expanded") === "true";

        buttons.forEach((item) => closeItem(item));

        if (!openNow) {
          openItem(btn);
        }
      });
    });
  });
};

const validateField = (field) => {
  const value = field.value.trim();
  let message = "";

  if (!value) {
    message = "This field is required.";
  } else if (field.type === "email") {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.test(value)) {
      message = "Enter a valid email address.";
    }
  } else if (field.type === "tel") {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) {
      message = "Enter a valid phone number.";
    }
  } else if (field.type === "password" && field.minLength > 0 && value.length < field.minLength) {
    message = `Use at least ${field.minLength} characters.`;
  }

  if (!message && field.dataset.match) {
    const match = document.getElementById(field.dataset.match);
    if (match && value !== match.value.trim()) {
      message = field.dataset.matchMessage || "This field must match.";
    }
  }

  const error = field.dataset.error ? document.getElementById(field.dataset.error) : null;

  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));

  if (error) {
    error.textContent = message;
  }

  return !message;
};

const setupForms = () => {
  document.querySelectorAll("[data-form]").forEach((form) => {
    const fields = Array.from(form.querySelectorAll("[required]"));
    const alert = form.querySelector("[data-alert]");
    const okText =
      form.dataset.ok || "Thank you. Your request has been received and our team will follow up soon.";
    const errorText =
      form.dataset.errorText || "Please complete the required fields before submitting.";

    const showAlert = (text, type) => {
      if (!alert) {
        return;
      }

      alert.hidden = false;
      alert.textContent = text;
      alert.classList.remove("ok", "error");
      alert.classList.add(type);
    };

    const clearAlert = () => {
      if (!alert) {
        return;
      }

      alert.hidden = true;
      alert.textContent = "";
      alert.classList.remove("ok", "error");
    };

    fields.forEach((field) => {
      ["input", "change", "blur"].forEach((name) => {
        field.addEventListener(name, () => {
          validateField(field);
          clearAlert();
        });
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstBad = null;
      let valid = true;

      fields.forEach((field) => {
        const pass = validateField(field);
        valid = valid && pass;

        if (!pass && !firstBad) {
          firstBad = field;
        }
      });

      if (!valid) {
        showAlert(errorText, "error");

        if (firstBad) {
          firstBad.focus();
        }

        return;
      }

      showAlert(okText, "ok");
      form.reset();

      fields.forEach((field) => {
        field.classList.remove("invalid");
        field.setAttribute("aria-invalid", "false");

        const error = field.dataset.error ? document.getElementById(field.dataset.error) : null;
        if (error) {
          error.textContent = "";
        }
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupScroll();
  setupFaq();
  setupForms();
});
