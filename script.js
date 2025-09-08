(function () {
  // Utils
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const form = $("#survey-form");
  const submitBtn = $("#submit");
  const progressBar = $("#form-progress");
  const toast = $("#toast");

  const fields = {
    name: $("#name"),
    lname: $("#lname"),
    email: $("#email"),
    age: $("#number"),
    discovery: $("#dropdown"),
    consent: $("#consent"),
    comments: $("#comments"),
    rating: $("#rating")
  };

  const requiredForProgress = ["name", "email", "discovery", "consent"];

  // Email regex (simple and effective)
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  // Error helpers
  function setError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add("error");

    // find sibling small.error-text, or create it
    let container = inputEl.closest(".form-control") || inputEl.parentElement;
    if (container) {
      let small = container.querySelector(".error-text");
      if (!small) {
        small = document.createElement("small");
        small.className = "error-text";
        container.appendChild(small);
      }
      small.textContent = message || "";
    }
  }

  function clearError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove("error");
    let container = inputEl.closest(".form-control") || inputEl.parentElement;
    if (container) {
      const small = container.querySelector(".error-text");
      if (small) small.textContent = "";
    }
  }

  // Toasts
  let toastTimer;
  function showToast(message, type = "success", timeout = 2500) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    toast.hidden = false;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => (toast.hidden = true), 180);
    }, timeout);
  }

  // Loading state
  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("loading", loading);
  }

  // Live rating output
  const rating = $("#rating");
  const ratingOut = $("#rating-output");
  function syncRating() {
    if (rating && ratingOut) ratingOut.textContent = rating.value;
  }
  if (rating) {
    rating.addEventListener("input", syncRating);
    syncRating();
  }

  // Live character counter for comments
  const count = $("#comment-count");
  const comments = $("#comments");
  function syncCommentCount() {
    if (!comments || !count) return;
    const max = parseInt(comments.getAttribute("maxlength") || "500", 10);
    count.textContent = `${comments.value.length}/${max}`;
  }
  if (comments) {
    comments.addEventListener("input", syncCommentCount);
    syncCommentCount();
  }

  // Progress bar
  function computeProgress() {
    const total = requiredForProgress.length;
    let got = 0;

    if (fields.name && fields.name.value.trim()) got++;
    if (fields.email && EMAIL_RE.test(fields.email.value.trim())) got++; // count valid email
    if (fields.discovery && fields.discovery.value) got++;
    if (fields.consent && fields.consent.checked) got++;

    const pct = Math.round((got / total) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
  }

  // Autosave / Restore
  const STORAGE_KEY = "survey-form-data";
  function saveForm() {
    const data = {
      name: fields.name?.value || "",
      lname: fields.lname?.value || "",
      email: fields.email?.value || "",
      age: fields.age?.value || "",
      discovery: fields.discovery?.value || "",
      consent: fields.consent?.checked || false,
      comments: fields.comments?.value || "",
      rating: fields.rating?.value || "7",
      // devices checkboxes
      devices: $$(".option-list input[name='devices']:checked").map(i => i.value),
      // radios
      browser: ($$("input[name='browser']:checked")[0]?.value) || "",
      satisfaction: ($$("input[name='satisfaction']:checked")[0]?.value) || ""
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
  }

  function restoreForm() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (fields.name) fields.name.value = data.name || "";
      if (fields.lname) fields.lname.value = data.lname || "";
      if (fields.email) fields.email.value = data.email || "";
      if (fields.age) fields.age.value = data.age || "";
      if (fields.discovery) fields.discovery.value = data.discovery || "";
      if (fields.consent) fields.consent.checked = !!data.consent;
      if (fields.comments) fields.comments.value = data.comments || "";
      if (fields.rating) fields.rating.value = data.rating || "7";

      // devices
      $$(".option-list input[name='devices']").forEach(i => {
        i.checked = (data.devices || []).includes(i.value);
      });

      // radios
      if (data.browser) {
        const el = $(`input[name='browser'][value='${CSS.escape(data.browser)}']`);
        if (el) el.checked = true;
      }
      if (data.satisfaction) {
        const el = $(`input[name='satisfaction'][value='${CSS.escape(data.satisfaction)}']`);
        if (el) el.checked = true;
      }

      syncRating();
      syncCommentCount();
      computeProgress();
    } catch { /* ignore */ }
  }

  // Debounce for autosave
  function debounce(fn, ms = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }
  const debouncedSave = debounce(saveForm, 250);

  // Validation
  function validate() {
    let valid = true;

    // Name
    if (fields.name) {
      const v = fields.name.value.trim();
      if (!v) {
        setError(fields.name, "First name is required.");
        valid = false;
      } else {
        clearError(fields.name);
      }
    }

    // Last name (optional but nice to validate)
    if (fields.lname) {
      const v = fields.lname.value.trim();
      if (!v) {
        setError(fields.lname, "Last name is required.");
        valid = false;
      } else {
        clearError(fields.lname);
      }
    }

    // Email
    if (fields.email) {
      const v = fields.email.value.trim();
      if (!v) {
        setError(fields.email, "Email is required.");
        valid = false;
      } else if (!EMAIL_RE.test(v)) {
        setError(fields.email, "Enter a valid email address.");
        valid = false;
      } else {
        clearError(fields.email);
      }
    }

    // Age (optional, but range-checked if provided)
    if (fields.age) {
      const v = fields.age.value.trim();
      if (v) {
        const n = Number(v);
        if (isNaN(n) || n < 1 || n > 80) {
          setError(fields.age, "Age must be between 1 and 80.");
          valid = false;
        } else {
          clearError(fields.age);
        }
      } else {
        clearError(fields.age);
      }
    }

    // Discovery required
    if (fields.discovery) {
      if (!fields.discovery.value) {
        setError(fields.discovery, "Please choose an option.");
        valid = false;
      } else {
        clearError(fields.discovery);
      }
    }

    // Consent required
    if (fields.consent) {
      const group = $("#consent-group");
      if (!fields.consent.checked) {
        // attach error to group small
        const small = group?.querySelector(".error-text");
        if (small) small.textContent = "Please agree to continue.";
        valid = false;
      } else {
        const small = group?.querySelector(".error-text");
        if (small) small.textContent = "";
      }
    }

    return valid;
  }

  // Clear error on input/change and update progress + autosave
  const inputsToWatch = $$("input, select, textarea");
  inputsToWatch.forEach(el => {
    const ev = el.tagName === "SELECT" || el.type === "checkbox" || el.type === "radio" ? "change" : "input";
    el.addEventListener(ev, () => {
      clearError(el);
      debouncedSave();
      computeProgress();
    });
  });

  // Restore previous session if any
  restoreForm();

  // Submit handler
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        computeProgress();
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      setLoading(true);

      // Mock async request
      await new Promise(res => setTimeout(res, 1200));

      setLoading(false);
      showToast("Thanks! Your response has been recorded.", "success", 3000);

      try { localStorage.removeItem(STORAGE_KEY); } catch {}

      // Reset form
      form.reset();
      syncRating();
      syncCommentCount();
      computeProgress();
    });
  }
})();