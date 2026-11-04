import { randomUUID } from 'node:crypto';
import { list, get, put } from '@vercel/blob';

const CATEGORIES = ['공부', '자소서', '포트폴리오', '운동'];
const HOUR_CATEGORIES = ['공부', '운동'];
const PREFIX = 'records/';

function send(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(payload));
}
function authorized(req) {
  const expected = process.env.API_TOKEN;
  const provided = req.headers?.authorization || '';
  return Boolean(expected && provided === 'Bearer ' + expected);
}
function safeText(value) { return String(value ?? '').slice(0, 200); }
function dateKey(value) {
  if (typeof value !== 'string' || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return '';
  const d = new Date(value + 'T00:00:00+09:00');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value ? value : '';
}
function todaySeoul() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return p.year + '-' + p.month + '-' + p.day;
}
async function readRecords() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const records = [];
  for (const blob of blobs) {
    const result = await get(blob.pathname, { access: 'private' });
    if (!result || result.statusCode !== 200) continue;
    const raw = await new Response(result.stream).text();
    try { records.push(JSON.parse(raw)); } catch { /* Ignore malformed records */ }
  }
  return records.sort((a, b) => (b.date + '-' + (b.createdAt || '')).localeCompare(a.date + '-' + (a.createdAt || '')));
}
function dashboardData(records) {
  const today = todaySeoul();
  const now = new Date(today + 'T12:00:00+09:00');
  const weekday = (now.getUTCDay() + 6) % 7;
  const monday = new Date(now.getTime() - weekday * 86400000);
  const sunday = new Date(monday.getTime() + 6 * 86400000);
  const fmt = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const mondayKey = fmt(monday), sundayKey = fmt(sunday);
  let totalHours = 0, restApprovedCount = 0, total = 0, approved = 0, todayTotal = 0, todayApproved = 0;
  for (const r of records) {
    total++;
    if (r.restStatus === '승인') approved++;
    if (r.date === today) { todayTotal++; if (r.restStatus === '승인') todayApproved++; }
    if (r.date >= mondayKey && r.date <= sundayKey) {
      if (HOUR_CATEGORIES.includes(r.category)) totalHours += Number(r.achieveValue) || 0;
      if (r.restStatus === '승인') restApprovedCount++;
    }
  }
  return { records, totalHours: Math.round(totalHours * 10) / 10, restApprovedCount,
    achievementRate: total ? Math.round(approved / total * 100) : 0,
    todayRate: todayTotal ? Math.round(todayApproved / todayTotal * 100) : 0 };
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: '허용되지 않은 요청입니다.' });
  if (!authorized(req)) return send(res, 401, { ok: false, error: 'unauthorized' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.action === 'data') return send(res, 200, { ok: true, data: dashboardData(await readRecords()) });
    if (body.action === 'add') {
      const record = body.record || {};
      const goal = Number(record.goalValue), achieve = Number(record.achieveValue), date = dateKey(record.date);
      if (!date) return send(res, 400, { ok: false, error: '날짜 형식이 올바르지 않습니다.' });
      if (!CATEGORIES.includes(record.category)) return send(res, 400, { ok: false, error: '항목이 올바르지 않습니다.' });
      if (!Number.isFinite(goal) || goal <= 0 || !Number.isFinite(achieve) || achieve < 0) {
        return send(res, 400, { ok: false, error: '목표와 달성 값을 확인해 주세요.' });
      }
      const entry = { date, category: record.category, goalValue: goal, achieveValue: achieve,
        restStatus: achieve >= goal ? '승인' : '미달', memo: safeText(record.memo),
        retrospect: safeText(record.retrospect), createdAt: new Date().toISOString() };
      const pathname = PREFIX + Date.now() + '-' + randomUUID() + '.json';
      await put(pathname, JSON.stringify(entry), { access: 'private', addRandomSuffix: false, contentType: 'application/json' });
      return send(res, 200, { ok: true, data: { message: '기록을 저장했습니다.' } });
    }
    return send(res, 400, { ok: false, error: '알 수 없는 요청입니다.' });
  } catch (error) {
    console.error('API error:', error);
    return send(res, 500, { ok: false, error: '서버 처리 중 오류가 발생했습니다.' });
  }
}
