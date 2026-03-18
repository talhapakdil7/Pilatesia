import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const WEEKDAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function parseLessonDate(startTime) {
  if (!startTime) return null;
  const s = String(startTime).trim().replace(" ", "T");
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekStart(d) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = getWeekStart(first);
  const end = getWeekStart(last);
  end.setDate(end.getDate() + 6);
  const cells = [];
  const cur = new Date(start);
  while (cur <= end || cells.length % 7 !== 0) {
    cells.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
    if (cur > end && cells.length % 7 === 0) break;
  }
  return cells;
}

function formatTime(d) {
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function LessonCalendar({ lessons = [] }) {
  const [viewMode, setViewMode] = useState("month");
  const [current, setCurrent] = useState(() => new Date());

  const lessonsByDate = useMemo(() => {
    const map = {};
    lessons.forEach((lesson) => {
      const d = parseLessonDate(lesson.start_time);
      if (!d) return;
      const key = dateKey(d);
      if (!map[key]) map[key] = [];
      map[key].push({ ...lesson, _date: d });
    });
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => a._date.getTime() - b._date.getTime());
    });
    return map;
  }, [lessons]);

  const monthGrid = useMemo(() => {
    if (viewMode !== "month") return [];
    return getMonthGrid(current.getFullYear(), current.getMonth());
  }, [viewMode, current]);

  const weekDays = useMemo(() => {
    if (viewMode !== "week") return [];
    const start = getWeekStart(new Date(current));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [viewMode, current]);

  const prev = () => {
    const next = new Date(current);
    if (viewMode === "month") next.setMonth(next.getMonth() - 1);
    else next.setDate(next.getDate() - 7);
    setCurrent(next);
  };

  const next = () => {
    const next = new Date(current);
    if (viewMode === "month") next.setMonth(next.getMonth() + 1);
    else next.setDate(next.getDate() + 7);
    setCurrent(next);
  };

  const goToday = () => setCurrent(new Date());

  const title =
    viewMode === "month"
      ? `${MONTH_NAMES[current.getMonth()]} ${current.getFullYear()}`
      : `Hafta ${getWeekStart(current).getDate()}.${getWeekStart(current).getMonth() + 1} - ${weekDays[6]?.getDate()}.${(weekDays[6]?.getMonth() ?? 0) + 1}.${current.getFullYear()}`;

  return (
    <div className="lesson-calendar card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <h5 className="fw-bold mb-0">Ders takvimi</h5>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${viewMode === "month" ? "btn-dark" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("month")}
              >
                Aylık
              </button>
              <button
                type="button"
                className={`btn ${viewMode === "week" ? "btn-dark" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("week")}
              >
                Haftalık
              </button>
            </div>
            <div className="d-flex align-items-center gap-1">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={prev} aria-label="Önceki">
                <i className="bi bi-chevron-left" />
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={goToday}>
                Bugün
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={next} aria-label="Sonraki">
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-muted small mb-3">{title}</p>

        {viewMode === "month" && (
          <div className="lesson-calendar-month">
            <div className="calendar-weekdays">
              {WEEKDAY_NAMES.map((name) => (
                <div key={name} className="calendar-weekday">
                  {name}
                </div>
              ))}
            </div>
            <div className="calendar-grid">
              {monthGrid.map((d, i) => {
                const key = dateKey(d);
                const isCurrentMonth = d.getMonth() === current.getMonth();
                const isToday =
                  d.getDate() === new Date().getDate() &&
                  d.getMonth() === new Date().getMonth() &&
                  d.getFullYear() === new Date().getFullYear();
                const dayLessons = lessonsByDate[key] || [];
                return (
                  <div
                    key={i}
                    className={`calendar-cell ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""}`}
                  >
                    <div className="calendar-cell-day">{d.getDate()}</div>
                    <div className="calendar-cell-lessons">
                      {dayLessons.slice(0, 3).map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/lessons/${lesson.id}`}
                          className="calendar-event"
                          title={`${lesson.title} — ${formatTime(lesson._date)}`}
                        >
                          <span className="calendar-event-time">{formatTime(lesson._date)}</span>
                          <span className="calendar-event-title">{lesson.title}</span>
                        </Link>
                      ))}
                      {dayLessons.length > 3 && (
                        <span className="calendar-more">+{dayLessons.length - 3} ders</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="lesson-calendar-week">
            <div className="calendar-week-row">
              {weekDays.map((d) => {
                const key = dateKey(d);
                const isToday =
                  d.getDate() === new Date().getDate() &&
                  d.getMonth() === new Date().getMonth() &&
                  d.getFullYear() === new Date().getFullYear();
                const dayLessons = lessonsByDate[key] || [];
                return (
                  <div key={key} className={`calendar-week-day ${isToday ? "today" : ""}`}>
                    <div className="calendar-week-day-name">{WEEKDAY_NAMES[d.getDay() === 0 ? 6 : d.getDay() - 1]}</div>
                    <div className="calendar-week-day-num">{d.getDate()}</div>
                    <div className="calendar-week-day-lessons">
                      {dayLessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/lessons/${lesson.id}`}
                          className="calendar-event calendar-event-week"
                          title={`${lesson.title} — ${formatTime(lesson._date)}`}
                        >
                          <span className="calendar-event-time">{formatTime(lesson._date)}</span>
                          <span className="calendar-event-title">{lesson.title}</span>
                          {lesson.instructor_name && (
                            <span className="calendar-event-instructor">{lesson.instructor_name}</span>
                          )}
                        </Link>
                      ))}
                      {dayLessons.length === 0 && (
                        <span className="text-muted small">Ders yok</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
