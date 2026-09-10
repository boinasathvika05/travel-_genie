import sys

with open(r'c:\Users\keerthana\Desktop\Travel_Genie\TravelGenie\mainapp\static\mainapp\css\base.css', 'r') as f:
    content = f.read()

missing_css = '''/* =========================================================
   5. TOP NAVIGATION
========================================================= */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 10px 0;
}

.topbar-center {
  display: flex;
  align-items: center;
  gap: 24px;
}

.top-nav-item {
  position: relative;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.2s var(--ease);
  padding-bottom: 6px;
  overflow: hidden;
}

.top-nav-item:hover, .top-nav-item.active {
  color: var(--primary-blue);
  font-weight: 600;
}

/* The airplane icon */
.top-nav-item::before {
  content: "\\f072";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  position: absolute;
  bottom: -2px;
  left: -20px;
  font-size: 13px;
  color: var(--primary-blue);
  opacity: 0;
  pointer-events: none;
}

.top-nav-item:hover::before, .top-nav-item.active::before {
  animation: navPlaneFly 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* The trail (underline) */
.top-nav-item::after {
  content: "";
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--primary-blue);
  opacity: 0.3;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.top-nav-item:hover::after, .top-nav-item.active::after {
  width: 100%;
}

@keyframes navPlaneFly {
  0% { left: -20px; opacity: 0; transform: translateY(0); }
  15% { opacity: 1; transform: translateY(-1px); }
  85% { opacity: 1; transform: translateY(-1px); }
  100% { left: 100%; opacity: 0; transform: translateY(-2px); }
}

.mobile-only {
  display: none;
}

.menu-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--card-white);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s var(--ease), transform 0.2s var(--ease);
}

.menu-btn:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

'''

content = content.replace('.theme-toggle {', missing_css + '.theme-toggle {')

with open(r'c:\Users\keerthana\Desktop\Travel_Genie\TravelGenie\mainapp\static\mainapp\css\base.css', 'w') as f:
    f.write(content)

print("CSS restored successfully")
