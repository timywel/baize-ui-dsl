import { NavLink, Routes, Route, Navigate, Link } from "react-router-dom";
import { ThemeProvider, I18nProvider } from "@timywel/baize-ui-dsl";
import { useState, useEffect } from "react";
import { Menu, Github, FileText, Sun, Moon, Languages } from "lucide-react";
import OverviewPage from "./pages/OverviewPage";
import WidgetPage from "./pages/WidgetPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import GuidePage from "./pages/GuidePage";
import { WIDGET_META, WIDGET_CATEGORIES } from "./widget-meta";

const TOP_NAV = [
  { path: "/", label: "指南", end: true },
  { path: "/widgets/kpi_grid", label: "组件" },
  { path: "/playground", label: "Playground" },
  { path: "/guide", label: "集成" },
];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [locale, setLocale] = useState<"zh-CN" | "en-US">("zh-CN");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // 主题持久: localStorage + prefers-color-scheme fallback
  useEffect(() => {
    const stored = localStorage.getItem("baize-ui-dsl-theme") as
      | "light"
      | "dark"
      | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("baize-ui-dsl-theme", theme);
  }, [theme]);

  const t = (key: string, fallback: string) => fallback;

  return (
    <ThemeProvider mode={theme}>
      <I18nProvider t={t} locale={locale}>
        <div className="app-layout">
          {/* 顶部导航 (element-plus 风) */}
          <header className="top-nav">
            <div className="top-nav-inner">
              <Link to="/" className="top-nav-logo">
                <span className="logo-mark">白</span>
                <span className="logo-text">
                  <span className="logo-title">baize-ui-dsl</span>
                  <span className="logo-version">v0.1.0</span>
                </span>
              </Link>

              <nav className="top-nav-tabs">
                {TOP_NAV.map((tab) => (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    end={tab.end}
                    className={({ isActive }) =>
                      `top-nav-tab ${isActive ? "active" : ""}`
                    }
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </nav>

              <div className="top-nav-actions">
                <a
                  href="https://github.com/timywel/baize-ui-dsl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="top-nav-icon-btn"
                  aria-label="GitHub"
                  title="GitHub 仓库"
                >
                  <Github size={16} />
                </a>
                <a
                  href="#"
                  className="top-nav-icon-btn"
                  aria-label="文档"
                  title="完整文档 (待生成)"
                >
                  <FileText size={16} />
                </a>
                <button
                  className="top-nav-icon-btn"
                  onClick={() =>
                    setLocale((l) => (l === "zh-CN" ? "en-US" : "zh-CN"))
                  }
                  aria-label="切换语言"
                  title="切换语言"
                >
                  <Languages size={16} />
                </button>
                <button
                  className="top-nav-icon-btn"
                  onClick={() =>
                    setTheme((t) => (t === "light" ? "dark" : "light"))
                  }
                  aria-label="切换主题"
                  title="切换主题"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </button>
                <button
                  className="top-nav-icon-btn mobile-only"
                  onClick={() => setMobileNavOpen((v) => !v)}
                  aria-label="菜单"
                >
                  <Menu size={16} />
                </button>
              </div>
            </div>

            {/* 移动端下拉 */}
            {mobileNavOpen && (
              <div className="mobile-nav-dropdown">
                {TOP_NAV.map((tab) => (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    end={tab.end}
                    className={({ isActive }) =>
                      `mobile-nav-item ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {tab.label}
                  </NavLink>
                ))}
                <div className="mobile-nav-divider">Widget</div>
                {WIDGET_META.map((w) => (
                  <NavLink
                    key={w.type}
                    to={`/widgets/${w.type}`}
                    className="mobile-nav-item"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {w.icon} {w.name}
                  </NavLink>
                ))}
              </div>
            )}
          </header>

          {/* 主体: 侧栏 + 主区 */}
          <div className="app-body">
            <aside className="sidebar">
              <div className="sidebar-section-title">Widget (8)</div>
              {WIDGET_CATEGORIES.map((cat) => {
                const items = WIDGET_META.filter(
                  (w) => w.category === cat.key,
                );
                if (items.length === 0) return null;
                return (
                  <div key={cat.key} style={{ marginBottom: "0.5rem" }}>
                    <div
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "10px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: "var(--color-text-muted)",
                        opacity: 0.7,
                      }}
                    >
                      {cat.icon} {cat.label}
                    </div>
                    <ul className="sidebar-nav">
                      {items.map((w) => (
                        <li key={w.type}>
                          <NavLink to={`/widgets/${w.type}`}>
                            <span className="sidebar-icon">{w.icon}</span>
                            {w.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              <div
                className="sidebar-section-title"
                style={{ marginTop: "1rem" }}
              >
                资源
              </div>
              <ul className="sidebar-nav">
                <li>
                  <a
                    href="https://github.com/timywel/baize-ui-dsl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sidebar-icon">📦</span>GitHub
                  </a>
                </li>
                <li>
                  <a href="#changelog">
                    <span className="sidebar-icon">📝</span>更新日志
                  </a>
                </li>
              </ul>
            </aside>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/playground" element={<PlaygroundPage />} />
                <Route
                  path="/widgets/:widgetType"
                  element={<WidgetPage widgetMeta={WIDGET_META} />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}