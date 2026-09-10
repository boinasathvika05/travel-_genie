(function () {
  'use strict';
 
  function init() {
    var sourceText   = document.getElementById('sourceText');
    var charCount    = document.getElementById('charCount');
    var sourceLang   = document.getElementById('sourceLang');
    var targetLang   = document.getElementById('targetLang');
    var outputBox    = document.getElementById('outputText');
    var translateBtn = document.getElementById('translateBtn');
    var translateLbl = document.getElementById('translateBtnLabel');
    var clearSourceBtn = document.getElementById('clearSourceBtn');
    var pasteBtn      = document.getElementById('pasteBtn');
    var voiceBtn      = document.getElementById('voiceBtn');
    var cameraBtn     = document.getElementById('cameraBtn');
    var copyBtn       = document.getElementById('copyBtn');
    var listenBtn     = document.getElementById('listenBtn');
    var shareBtn      = document.getElementById('shareBtn');
    var downloadBtn   = document.getElementById('downloadBtn');
    var swapBtn       = document.getElementById('swapLangBtn');
    var swapBtnInline = document.getElementById('swapLangBtnInline');
    var clearHistoryBtn = document.getElementById('clearHistoryBtn');
    var savedList     = document.getElementById('savedList');
    var viewAllRecentBtn = document.getElementById('viewAllRecentBtn');

    var MAX_CHARS = 5000;

    /* ---------------- Toast Notification Helper ---------------- */
    function showToast(message, type) {
      var existing = document.getElementById('trToast');
      if (existing) existing.remove();
  
      var toast = document.createElement('div');
      toast.id = 'trToast';
      Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '32px',
        right:        '32px',
        zIndex:       '999999',
        background:   type === 'success' ? '#00C48C' : '#5C7392',
        color:        '#fff',
        padding:      '14px 20px',
        borderRadius: '14px',
        fontSize:     '13.5px',
        fontFamily:   'Poppins, sans-serif',
        fontWeight:   '500',
        boxShadow:    '0 14px 40px rgba(0,0,0,0.22)',
        maxWidth:     '320px',
        whiteSpace:   'pre-line',
        lineHeight:   '1.6',
        opacity:      '0',
        transform:    'translateY(16px)',
        transition:   'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents:'none'
      });
      toast.textContent = message;
      document.body.appendChild(toast);
  
      toast.getBoundingClientRect(); // force reflow
      toast.style.opacity   = '1';
      toast.style.transform = 'translateY(0)';
  
      setTimeout(function () {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(16px)';
        setTimeout(function () {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 400);
      }, 3000);
    }
 
    /* ---------------- Character counter ---------------- */
    sourceText.addEventListener('input', function () {
      var len = sourceText.value.length;
      charCount.textContent = len;
      charCount.parentElement.style.color = len >= MAX_CHARS ? '#E0554B' : '';
    });
 
    /* ---------------- Clear source ---------------- */
    clearSourceBtn.addEventListener('click', function () {
      sourceText.value = '';
      charCount.textContent = '0';
      sourceText.focus();
    });
 
    /* ---------------- Paste from clipboard ---------------- */
    pasteBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function (text) {
          sourceText.value = (sourceText.value + text).slice(0, MAX_CHARS);
          charCount.textContent = sourceText.value.length;
        }).catch(function () {
          sourceText.focus();
        });
      } else {
        sourceText.focus();
      }
    });
 
    /* ---------------- Voice input (Web Speech API) ---------------- */
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognizing = false;
    var recognizer = null;
 
    if (Recognition) {
      recognizer = new Recognition();
      recognizer.interimResults = false;
      recognizer.maxAlternatives = 1;
 
      recognizer.addEventListener('result', function (e) {
        var transcript = e.results[0][0].transcript;
        sourceText.value = (sourceText.value + ' ' + transcript).trim().slice(0, MAX_CHARS);
        charCount.textContent = sourceText.value.length;
      });
 
      recognizer.addEventListener('end', function () {
        recognizing = false;
        voiceBtn.classList.remove('active');
      });
    }
 
    voiceBtn.addEventListener('click', function () {
      if (!recognizer) {
        voiceBtn.classList.add('active');
        setTimeout(function () { voiceBtn.classList.remove('active'); }, 900);
        return;
      }
      if (recognizing) {
        recognizer.stop();
        return;
      }
      try {
        recognizer.lang = langToBCP47(sourceLang.value);
        recognizer.start();
        recognizing = true;
        voiceBtn.classList.add('active');
      } catch (err) {
        recognizing = false;
      }
    });
 
    /* ---------------- Camera OCR (placeholder trigger) ---------------- */
    cameraBtn.addEventListener('click', function () {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.addEventListener('change', function () {
        if (input.files && input.files[0]) {
          cameraBtn.classList.add('active');
          sourceText.placeholder = 'Scanning image for text...';
          setTimeout(function () {
            cameraBtn.classList.remove('active');
            sourceText.placeholder = 'Type or paste your travel conversation...';
          }, 1200);
        }
      });
      input.click();
    });
 
    /* ---------------- Swap languages ---------------- */
    function swapLanguages() {
      var tmp = sourceLang.value;
      sourceLang.value = targetLang.value;
      targetLang.value = tmp;
 
      var outputSpan = outputBox.querySelector('.tr-output-text');
      if (outputSpan) {
        sourceText.value = outputSpan.textContent;
        charCount.textContent = sourceText.value.length;
        clearOutput();
      }
    }
    swapBtn.addEventListener('click', swapLanguages);
    swapBtnInline.addEventListener('click', swapLanguages);
 
    /* ---------------- Translate (Real API) ---------------- */
    translateBtn.addEventListener('click', function () {
      var text = sourceText.value.trim();
      var from = sourceLang.value;
      var to = targetLang.value;

      if (!text) {
        sourceText.focus();
        sourceText.style.borderColor = '#E0554B';
        setTimeout(function () { sourceText.style.borderColor = ''; }, 900);
        return;
      }
 
      translateBtn.classList.add('loading');
      translateBtn.disabled = true;
      translateLbl.textContent = 'Translating…';

      if (from === to) {
        finishTranslation(text, text);
        return;
      }

      var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + from + '|' + to;
      
      fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (data) {
          var translated = text; // fallback
          if (data && data.responseData && data.responseData.translatedText) {
            translated = data.responseData.translatedText;
          }
          finishTranslation(text, translated);
        })
        .catch(function (err) {
          console.error("Translation API error:", err);
          finishTranslation(text, "⚠️ Network Error: Could not translate.");
        });
    });

    function finishTranslation(original, translated) {
      renderOutput(translated);
      addToHistory(sourceLang, targetLang, original, translated);
 
      translateBtn.classList.remove('loading');
      translateBtn.disabled = false;
      translateLbl.textContent = '🌍 Translate Now';
    }
 
    function renderOutput(translated) {
      outputBox.innerHTML = '<span class="tr-output-text">' + escapeHTML(translated) + '</span>';
      outputBox.classList.add('has-text');
    }
 
    function clearOutput() {
      outputBox.innerHTML = '<span class="tr-output-placeholder">Translation will appear here...</span>';
      outputBox.classList.remove('has-text');
    }
 
    /* ---------------- Copy output ---------------- */
    copyBtn.addEventListener('click', function () {
      var span = outputBox.querySelector('.tr-output-text');
      var text = span ? span.textContent : '';
      if (!text) return;
      copyToClipboard(text);
      flashButton(copyBtn, 'fa-check', 'fa-copy');
    });
 
    /* ---------------- Listen (speech synthesis) ---------------- */
    // Eagerly load voices for Chrome
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function() {
        window.speechSynthesis.getVoices();
      };
    }

    listenBtn.addEventListener('click', function () {
      var span = outputBox.querySelector('.tr-output-text');
      var text = span ? span.textContent : '';
      if (!text) return;
      
      var targetPrefix = targetLang.value.toLowerCase();
      var voice = null;
      
      if (window.speechSynthesis) {
        var voices = window.speechSynthesis.getVoices();
        voice = voices.find(function(v) { 
          return v.lang.toLowerCase().indexOf(targetPrefix) === 0; 
        });
      }

      if (voice) {
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = langToBCP47(targetLang.value);
        utter.voice = voice;
        window.speechSynthesis.cancel();
        setTimeout(function() {
          window.speechSynthesis.speak(utter);
        }, 50);
      } else {
        // Fallback for missing local voices (common for Arabic on Windows)
        var safeText = text.substring(0, 200); 
        var audioUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + targetLang.value + '&q=' + encodeURIComponent(safeText);
        var audio = new Audio(audioUrl);
        audio.play().catch(function(e) { console.error("Audio fallback failed:", e); });
      }
    });
 
    /* ---------------- Share ---------------- */
    shareBtn.addEventListener('click', function () {
      var span = outputBox.querySelector('.tr-output-text');
      var text = span ? span.textContent : '';
      if (!text) return;
      if (navigator.share) {
        navigator.share({ text: text }).catch(function () {});
      } else {
        copyToClipboard(text);
        flashButton(shareBtn, 'fa-check', 'fa-share-nodes');
      }
    });
 
    /* ---------------- Download ---------------- */
    downloadBtn.addEventListener('click', function () {
      var span = outputBox.querySelector('.tr-output-text');
      var text = span ? span.textContent : '';
      if (!text) return;
      var blob = new Blob([text], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'translation.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
 
    /* ---------------- History: copy item ---------------- */
    document.querySelectorAll('.tr-copy-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.tr-history-item');
        var translated = item.querySelector('.tr-history-translated');
        if (translated) {
          copyToClipboard(translated.textContent);
          flashButton(btn, 'fa-check', 'fa-copy');
        }
      });
    });
 
    /* ---------------- Clear saved history ---------------- */
    clearHistoryBtn.addEventListener('click', function (e) {
      e.preventDefault();
      savedList.innerHTML = '';
    });
 
    /* ---------------- View All Recent ---------------- */
    if (viewAllRecentBtn) {
      viewAllRecentBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('📜 All recent translations are already displayed.', 'info');
      });
    }

    /* ---------------- Add new translation to Saved History ---------------- */
    function addToHistory(sourceSelect, targetSelect, original, translated) {
      var sourceLabel = sourceSelect.options[sourceSelect.selectedIndex].text.replace(/^\S+\s/, '');
      var targetLabel = targetSelect.options[targetSelect.selectedIndex].text.replace(/^\S+\s/, '');
 
      var li = document.createElement('li');
      li.className = 'tr-history-item';
      li.innerHTML =
        '<div class="tr-history-top">' +
          '<span class="tr-lang-pair">' + escapeHTML(sourceLabel) + ' → ' + escapeHTML(targetLabel) + '</span>' +
          '<button type="button" class="tr-mini-icon-btn tr-copy-item" aria-label="Copy translation"><i class="fa-regular fa-copy"></i></button>' +
        '</div>' +
        '<p class="tr-history-original">' + escapeHTML(original) + '</p>' +
        '<p class="tr-history-translated">' + escapeHTML(translated) + '</p>' +
        '<span class="tr-history-time">Just now</span>';
 
      li.querySelector('.tr-copy-item').addEventListener('click', function () {
        copyToClipboard(translated);
        flashButton(li.querySelector('.tr-copy-item'), 'fa-check', 'fa-copy');
      });
 
      savedList.insertBefore(li, savedList.firstChild);
    }
 
    /* ---------------- Helpers ---------------- */
    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
    }
 
    function flashButton(btn, tempIconClass, originalIconClass) {
      var icon = btn.querySelector('i');
      if (!icon) return;
      icon.classList.remove(originalIconClass);
      icon.classList.add(tempIconClass);
      setTimeout(function () {
        icon.classList.remove(tempIconClass);
        icon.classList.add(originalIconClass);
      }, 1200);
    }
 
    function langToBCP47(code) {
      var map = {
        en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE',
        ja: 'ja-JP', hi: 'hi-IN', ta: 'ta-IN', ar: 'ar-SA'
      };
      return map[code] || 'en-US';
    }
 
    function escapeHTML(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
 