import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace Root Tokens
css = css.replace(
  /:root \{([\s\S]*?)\}/,
  `:root {
  --bg-dark: #f8f9fc;
  --bg-card: #ffffff;
  --bg-card2: #fafafa;
  --border: rgba(0,0,0,0.08);
  --border-hover: rgba(0,0,0,0.18);

  --accent-blue: #ff8c00;
  --accent-green: #22c55e;
  --accent-purple: #a855f7;
  --accent-amber: #f59e0b;
  --accent-red: #ef4444;
  --accent-teal: #14b8a6;

  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --text-muted: #888888;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  --shadow-glow-blue: 0 0 20px rgba(255,140,0,0.25);
  --shadow-glow-green: 0 0 20px rgba(34,197,94,0.25);
  --shadow-card: 0 4px 24px rgba(0,0,0,0.06);
}`
);

// Replace rgba(255,255,255,...) with rgba(0,0,0,...) for transparent white
// We only replace if the alpha is < 1, e.g., 0.XX
css = css.replace(/rgba\(255,\s*255,\s*255,\s*(0\.\d+)\)/g, 'rgba(0,0,0,$1)');

// Replace 13,17,23 navbar background
css = css.replace(/rgba\(13,17,23,0\.9\)/g, 'rgba(255,255,255,0.9)');

// Replace page-wrapper gradients
css = css.replace(
  /radial-gradient\(ellipse at 20% 20%, rgba\(59,130,246,0\.12\) 0%, transparent 55%\),\s*radial-gradient\(ellipse at 80% 80%, rgba\(168,85,247,0\.10\) 0%, transparent 55%\),\s*radial-gradient\(ellipse at 50% 50%, rgba\(20,184,166,0\.05\) 0%, transparent 70%\)/,
  `radial-gradient(ellipse at 20% 20%, rgba(255,140,0,0.08) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 80%, rgba(255,200,0,0.08) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(255,100,0,0.04) 0%, transparent 70%)`
);

// Select option background
css = css.replace(/select option \{ background: #1c2333;/g, 'select option { background: #ffffff;');

// Primary button hovers
css = css.replace(/background: #2563eb; box-shadow: 0 4px 16px rgba\(59,130,246,0\.5\)/g, 'background: #e67e22; box-shadow: 0 4px 16px rgba(255,140,0,0.5)');
css = css.replace(/rgba\(59,130,246,0\.35\)/g, 'rgba(255,140,0,0.35)');

// login page gradients
css = css.replace(
  /radial-gradient\(ellipse at 30% 30%, rgba\(59,130,246,0\.15\) 0%, transparent 60%\),\s*radial-gradient\(ellipse at 70% 70%, rgba\(168,85,247,0\.12\) 0%, transparent 60%\)/,
  `radial-gradient(ellipse at 30% 30%, rgba(255,140,0,0.1) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 70%, rgba(255,200,0,0.08) 0%, transparent 60%)`
);

// login card shadow
css = css.replace(/box-shadow: 0 8px 48px rgba\(0,0,0,0\.5\);/g, 'box-shadow: 0 8px 48px rgba(0,0,0,0.08);');

// role-pill active
css = css.replace(/rgba\(59,130,246,0\.12\)/g, 'rgba(255,140,0,0.12)');

// alert info border & color
css = css.replace(/border: 1px solid rgba\(59,130,246,0\.25\); color: #60a5fa;/g, 'border: 1px solid rgba(255,140,0,0.25); color: #e67e22;');
css = css.replace(/rgba\(59,130,246,0\.15\)/g, 'rgba(255,140,0,0.15)');
css = css.replace(/color: #60a5fa;/g, 'color: #e67e22;'); 

// focus shadow
css = css.replace(/rgba\(59,130,246,0\.15\)/g, 'rgba(255,140,0,0.15)');
css = css.replace(/rgba\(59,130,246,0\.4\)/g, 'rgba(255,140,0,0.4)');

fs.writeFileSync('src/index.css', css);
console.log('Updated index.css successfully');
