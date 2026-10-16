/** Demo domain only: mutable JSON state, explicit clocks, no I/O or dependencies.
 * These guards demonstrate UX rules. Browser state, clocks and images are not
 * secure; production requires server authorization, transactions and private media.
 */
const fail = (code) => { throw Object.assign(new Error(code), { code }); };
const clock = (now) => { if (!Number.isSafeInteger(now) || now < 0) fail('INVALID_TIME'); };
const user = (state, id) => state.users.find((item) => item.id === id) ?? fail('UNKNOWN_USER');
export const pairKey = (a, b) => JSON.stringify([a, b].sort());
const blocked = (state, a, b) => state.blocks.some((item) => pairKey(...item) === pairKey(a, b));
const versions = (state, match) => match.users.map((id) => user(state, id).photoVersion);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const consentValid = (state, match, id) => match.consents.some((item) =>
  item.userId === id && same(item.photoVersions, versions(state, match)) && item.policyVersion === state.policyVersion);
const memberMatch = (state, matchId, id) => {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match || !match.users.includes(id)) fail('MATCH_NOT_FOUND');
  return match;
};
const chronology = (match, now) => {
  clock(now);
  const latest = Math.max(match.createdAt, match.messages.at(-1)?.createdAt ?? 0,
    ...match.consents.map((item) => item.createdAt));
  if (now < latest) fail('INVALID_TIME');
};
const active = (state, match, now) => {
  chronology(match, now);
  if (match.status !== 'ACTIVE' || blocked(state, ...match.users)) fail('MATCH_INACTIVE');
};

export function createDemoState({ userIds = ['you', 'ana'], waitMs = 86400000, turnsRequired = 5 } = {}) {
  if (!Array.isArray(userIds) || userIds.length < 2 || new Set(userIds).size !== userIds.length ||
    userIds.some((id) => typeof id !== 'string' || !id.trim())) fail('INVALID_USERS');
  if (!Number.isSafeInteger(waitMs) || waitMs < 0 || !Number.isSafeInteger(turnsRequired) || turnsRequired < 1) fail('INVALID_POLICY');
  return { users: userIds.map((id) => ({ id, photoVersion: 1 })), waitMs, turnsRequired, policyVersion: 1,
    likes: [], matches: [], blocks: [] };
}

export function getMatch(state, a, b) {
  return state.matches.find((item) => item.id === pairKey(a, b)) ?? null;
}

export function like(state, from, to, now) {
  clock(now); user(state, from); user(state, to);
  if (from === to) fail('SELF_LIKE');
  if (blocked(state, from, to)) fail('BLOCKED');
  const existing = getMatch(state, from, to);
  if (existing) {
    active(state, existing, now);
    return existing;
  }
  if (!state.likes.some((item) => item[0] === from && item[1] === to)) state.likes.push([from, to]);
  if (!state.likes.some((item) => item[0] === to && item[1] === from)) return null;
  const match = { id: pairKey(from, to), users: [from, to].sort(), status: 'ACTIVE', createdAt: now,
    bilateralAt: null, messages: [], consents: [], authorizationVersion: 1 };
  state.matches.push(match);
  return match;
}

export function sendMessage(state, matchId, from, text, now, clientMessageId) {
  const match = memberMatch(state, matchId, from); active(state, match, now);
  if (typeof clientMessageId !== 'string' || !clientMessageId.trim() || clientMessageId.length > 128) fail('INVALID_MESSAGE_ID');
  if (typeof text !== 'string' || !text.trim() || text.length > 2000) fail('INVALID_MESSAGE');
  const duplicate = match.messages.find((item) => item.from === from && item.clientMessageId === clientMessageId);
  if (duplicate) {
    if (duplicate.text !== text.trim()) fail('IDEMPOTENCY_CONFLICT');
    return duplicate;
  }
  if (now < (match.messages.at(-1)?.createdAt ?? match.createdAt)) fail('INVALID_TIME');
  const message = { id: match.messages.length + 1, from, text: text.trim(), createdAt: now, clientMessageId };
  match.messages.push(message);
  if (match.bilateralAt === null && match.messages.some((item) => item.from !== from)) match.bilateralAt = now;
  return message;
}

export function getRevealView(state, matchId, userId, now) {
  clock(now);
  const match = memberMatch(state, matchId, userId);
  chronology(match, now);
  const turns = Object.fromEntries(match.users.map((id) => [id, 0]));
  let previous;
  for (const message of match.messages) {
    if (message.from !== previous) turns[message.from]++;
    previous = message.from;
  }
  const eligibleAt = match.bilateralAt === null ? null : match.bilateralAt + state.waitMs;
  const available = match.status === 'ACTIVE' && !blocked(state, ...match.users);
  const eligible = eligibleAt !== null && now >= eligibleAt && match.users.every((id) => turns[id] >= state.turnsRequired);
  const revealed = eligible && match.users.every((id) => consentValid(state, match, id));
  return { status: !available ? 'UNAVAILABLE' : revealed ? 'REVEALED' : eligible ? 'ELIGIBLE' : 'LOCKED',
    ownConsent: available && consentValid(state, match, userId), turns, eligibleAt,
    photoVersions: versions(state, match) };
}

export function consentPhoto(state, matchId, userId, now, expectedVersions) {
  const match = memberMatch(state, matchId, userId); active(state, match, now);
  if (expectedVersions !== undefined && !same(expectedVersions, versions(state, match))) fail('CONSENT_VERSION_STALE');
  const view = getRevealView(state, matchId, userId, now);
  if (view.status === 'LOCKED') fail('REVEAL_LOCKED');
  if (!consentValid(state, match, userId)) {
    match.consents = match.consents.filter((item) => item.userId !== userId);
    match.consents.push({ userId, photoVersions: versions(state, match), policyVersion: state.policyVersion, createdAt: now });
  }
  return getRevealView(state, matchId, userId, now);
}

export function revokeConsent(state, matchId, userId) {
  const match = memberMatch(state, matchId, userId);
  match.consents = match.consents.filter((item) => item.userId !== userId);
  match.authorizationVersion++;
}

export function canViewPhoto(state, matchId, viewerId, ownerId, now) {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match || !match.users.includes(viewerId) || !match.users.includes(ownerId) || viewerId === ownerId) return false;
  return getRevealView(state, matchId, viewerId, now).status === 'REVEALED';
}

export function changePhoto(state, userId) {
  const person = user(state, userId); person.photoVersion++;
  for (const match of state.matches.filter((item) => item.users.includes(userId))) {
    match.consents = []; match.authorizationVersion++;
  }
  return person.photoVersion;
}

export function block(state, from, to) {
  user(state, from); user(state, to);
  if (from === to) fail('SELF_BLOCK');
  if (!state.blocks.some((item) => item[0] === from && item[1] === to)) state.blocks.push([from, to]);
  const match = getMatch(state, from, to);
  if (match && match.status !== 'BLOCKED') {
    match.status = 'BLOCKED'; match.consents = []; match.authorizationVersion++;
  }
}

export function unmatch(state, matchId, userId) {
  const match = memberMatch(state, matchId, userId);
  if (match.status === 'ACTIVE') { match.status = 'UNMATCHED'; match.consents = []; match.authorizationVersion++; }
}
