/**
 * Raise Punch — Code Linter
 * Validates the HTML source file for common issues and code quality.
 * Run: node scripts/lint.js
 */

const fs = require('fs');
const path = require('path');

const SRC_FILE = path.join(__dirname, '..', 'src', 'index.html');
const ERRORS = [];
const WARNINGS = [];

function error(msg, line) {
  ERRORS.push({ msg, line });
}

function warn(msg, line) {
  WARNINGS.push({ msg, line });
}

function lint() {
  if (!fs.existsSync(SRC_FILE)) {
    console.error('ERROR: Source file not found at ' + SRC_FILE);
    process.exit(1);
  }

  const content = fs.readFileSync(SRC_FILE, 'utf8');
  const lines = content.split('\n');

  console.log('Linting src/index.html (' + lines.length + ' lines)...\n');

  // Check DOCTYPE
  if (!lines[0].trim().toLowerCase().startsWith('<!doctype html>')) {
    error('Missing <!DOCTYPE html> declaration', 1);
  }

  // Check meta charset
  const hasCharset = content.includes('charset="UTF-8"') || content.includes("charset='UTF-8'");
  if (!hasCharset) {
    error('Missing UTF-8 charset meta tag');
  }

  // Check viewport meta
  if (!content.includes('viewport')) {
    error('Missing viewport meta tag for responsive design');
  }

  // Check for console.log statements (should not be in production)
  lines.forEach(function(line, i) {
    if (line.includes('console.log') && !line.trim().startsWith('//')) {
      warn('console.log found — remove for production', i + 1);
    }
  });

  // Check for eval() usage (security risk)
  lines.forEach(function(line, i) {
    if (line.includes('eval(') && !line.trim().startsWith('//')) {
      error('eval() usage detected — security risk', i + 1);
    }
  });

  // Check for inline event handlers (best practice)
  const inlineHandlers = ['onclick=', 'onmouseover=', 'onkeydown=', 'onsubmit='];
  let inlineCount = 0;
  lines.forEach(function(line, i) {
    inlineHandlers.forEach(function(handler) {
      if (line.includes(handler)) {
        inlineCount++;
      }
    });
  });
  if (inlineCount > 20) {
    warn('High number of inline event handlers (' + inlineCount + '). Consider using addEventListener.', null);
  }

  // Check for TODO/FIXME comments
  lines.forEach(function(line, i) {
    if (line.includes('TODO') || line.includes('FIXME') || line.includes('HACK')) {
      warn('Found TODO/FIXME/HACK comment', i + 1);
    }
  });

  // Check for proper closing tags
  const openTags = (content.match(/<script[\s>]/g) || []).length;
  const closeTags = (content.match(/<\/script>/g) || []).length;
  if (openTags !== closeTags) {
    error('Mismatched <script> tags: ' + openTags + ' open, ' + closeTags + ' close');
  }

  const openStyle = (content.match(/<style[\s>]/g) || []).length;
  const closeStyle = (content.match(/<\/style>/g) || []).length;
  if (openStyle !== closeStyle) {
    error('Mismatched <style> tags: ' + openStyle + ' open, ' + closeStyle + ' close');
  }

  // Check for accessibility basics
  if (!content.includes('lang="en"') && !content.includes("lang='en'")) {
    warn('Missing lang attribute on <html> tag');
  }

  // Check for title tag
  if (!content.includes('<title>')) {
    error('Missing <title> tag');
  }

  // Check localStorage usage has try/catch
  const lsWrites = (content.match(/localStorage\.setItem/g) || []).length;
  const tryCatches = (content.match(/try\s*\{/g) || []).length;
  if (lsWrites > 0 && tryCatches === 0) {
    warn('localStorage usage without try/catch — may fail in private browsing');
  }

  // Check CSS custom properties are defined
  const cssVarUsage = content.match(/var\(--([a-zA-Z-]+)\)/g) || [];
  const cssVarDefs = content.match(/--([a-zA-Z-]+)\s*:/g) || [];
  const definedVars = cssVarDefs.map(function(v) { return v.replace(':', '').trim(); });
  const usedVars = cssVarUsage.map(function(v) { return v.match(/--([a-zA-Z-]+)/)[0]; });
  const undefinedVars = usedVars.filter(function(v) { return definedVars.indexOf(v) === -1; });
  const uniqueUndefined = Array.from(new Set(undefinedVars));
  if (uniqueUndefined.length > 0) {
    uniqueUndefined.forEach(function(v) {
      warn('CSS variable ' + v + ' used but not defined in :root');
    });
  }

  // Report results
  console.log('Results:');
  console.log('  Errors:   ' + ERRORS.length);
  console.log('  Warnings: ' + WARNINGS.length);
  console.log('');

  if (ERRORS.length > 0) {
    console.log('ERRORS:');
    ERRORS.forEach(function(e) {
      var loc = e.line ? ' (line ' + e.line + ')' : '';
      console.log('  \u2718 ' + e.msg + loc);
    });
    console.log('');
  }

  if (WARNINGS.length > 0) {
    console.log('WARNINGS:');
    WARNINGS.forEach(function(w) {
      var loc = w.line ? ' (line ' + w.line + ')' : '';
      console.log('  \u26A0 ' + w.msg + loc);
    });
    console.log('');
  }

  if (ERRORS.length === 0) {
    console.log('\u2714 Lint passed with ' + WARNINGS.length + ' warning(s).');
    process.exit(0);
  } else {
    console.log('\u2718 Lint failed with ' + ERRORS.length + ' error(s).');
    process.exit(1);
  }
}

lint();
