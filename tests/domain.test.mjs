import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoState, pairKey, getMatch, like, sendMessage, getRevealView, consentPhoto,
  revokeConsent, canViewPhoto, changePhoto, block, unmatch } from '../dist/domain.mjs';

function fixture(options = {}) {
  const state = createDemoState({ userIds: ['a', 'b', 'c'], waitMs: 100, ...options });
  like(state, 'a', 'b', 0);
  const match = like(state, 'b', 'a', 0);
  return { state, match };
}
function talk(state, match, count = 10) {
  for (let i = 0; i < count; i++) sendMessage(state, match.id, i % 2 ? 'b' : 'a', `Livro ${i}`, i, `m${i}`);
}
const code = (expected) => (error) => error.code === expected;

test('pair normalization cannot collide on delimiters', () => {
  assert.equal(pairKey('b', 'a'), pairKey('a', 'b'));
  assert.notEqual(pairKey('a:b', 'c'), pairKey('a', 'b:c'));
});
test('mutual likes create exactly one match; repeated likes reuse it', () => {
  const state = createDemoState({ userIds: ['a', 'b'] });
  assert.equal(like(state, 'a', 'b', 0), null);
  const match = like(state, 'b', 'a', 1);
  assert.equal(like(state, 'a', 'b', 2), match);
  assert.equal(state.matches.length, 1);
  assert.equal(state.likes.length, 2);
  assert.equal(getMatch(state, 'b', 'a'), match);
});
test('reject self, unknown participants, invalid policy and invalid clock', () => {
  const { state } = fixture();
  assert.throws(() => like(state, 'a', 'a', 1), code('SELF_LIKE'));
  assert.throws(() => like(state, 'a', 'x', 1), code('UNKNOWN_USER'));
  assert.throws(() => like(state, 'a', 'c', NaN), code('INVALID_TIME'));
  assert.throws(() => createDemoState({ waitMs: -1 }), code('INVALID_POLICY'));
});
test('window starts at first bilateral reply, with inclusive eligibility boundary', () => {
  const { state, match } = fixture(); talk(state, match);
  assert.equal(match.bilateralAt, 1);
  assert.equal(getRevealView(state, match.id, 'a', 100).status, 'LOCKED');
  assert.equal(getRevealView(state, match.id, 'a', 101).status, 'ELIGIBLE');
});
test('one-sided or consecutive spam does not supply alternating turns', () => {
  const { state, match } = fixture({ waitMs: 0 });
  for (let i = 0; i < 20; i++) sendMessage(state, match.id, 'a', 'Oi', i, `${i}`);
  assert.equal(getRevealView(state, match.id, 'a', 1000).eligibleAt, null);
  sendMessage(state, match.id, 'b', 'Olá', 20, 'reply');
  const view = getRevealView(state, match.id, 'a', 1000);
  assert.deepEqual(view.turns, { a: 1, b: 1 });
  assert.equal(view.status, 'LOCKED');
});
test('messages are idempotent, reject payload reuse, empty text and backward clock', () => {
  const { state, match } = fixture();
  const message = sendMessage(state, match.id, 'a', 'Oi', 10, 'one');
  assert.equal(sendMessage(state, match.id, 'a', 'Oi', 11, 'one'), message);
  assert.equal(match.messages.length, 1);
  assert.throws(() => sendMessage(state, match.id, 'a', 'Outro', 11, 'one'), code('IDEMPOTENCY_CONFLICT'));
  assert.throws(() => sendMessage(state, match.id, 'a', ' ', 11, 'two'), code('INVALID_MESSAGE'));
  assert.throws(() => sendMessage(state, match.id, 'b', 'Oi', 9, 'two'), code('INVALID_TIME'));
});
test('early consent fails and unilateral consent is private to its author', () => {
  const { state, match } = fixture();
  assert.throws(() => consentPhoto(state, match.id, 'a', 0), code('REVEAL_LOCKED'));
  talk(state, match);
  const before = getRevealView(state, match.id, 'b', 101);
  consentPhoto(state, match.id, 'a', 101);
  assert.deepEqual(getRevealView(state, match.id, 'b', 101), before);
  assert.equal(getRevealView(state, match.id, 'a', 101).ownConsent, true);
  assert.equal(canViewPhoto(state, match.id, 'b', 'a', 101), false);
});
test('two current consents reveal in both directions and retries do not duplicate consent', () => {
  const { state, match } = fixture(); talk(state, match);
  consentPhoto(state, match.id, 'a', 101, [1, 1]);
  consentPhoto(state, match.id, 'b', 101, [1, 1]);
  consentPhoto(state, match.id, 'a', 102, [1, 1]);
  assert.equal(match.consents.length, 2);
  assert.equal(canViewPhoto(state, match.id, 'a', 'b', 102), true);
  assert.equal(canViewPhoto(state, match.id, 'b', 'a', 102), true);
});
test('changing either photo resets both consents and rejects stale versions', () => {
  const { state, match } = fixture(); talk(state, match);
  consentPhoto(state, match.id, 'a', 101); consentPhoto(state, match.id, 'b', 101);
  assert.equal(changePhoto(state, 'b'), 2);
  assert.equal(match.consents.length, 0);
  assert.equal(canViewPhoto(state, match.id, 'a', 'b', 102), false);
  assert.throws(() => consentPhoto(state, match.id, 'a', 102, [1, 1]), code('CONSENT_VERSION_STALE'));
  consentPhoto(state, match.id, 'a', 102, [1, 2]);
  assert.equal(canViewPhoto(state, match.id, 'a', 'b', 102), false);
});
test('revoke denies future reads without ending conversation', () => {
  const { state, match } = fixture(); talk(state, match);
  consentPhoto(state, match.id, 'a', 101); consentPhoto(state, match.id, 'b', 101);
  revokeConsent(state, match.id, 'a');
  assert.equal(canViewPhoto(state, match.id, 'b', 'a', 102), false);
  assert.equal(sendMessage(state, match.id, 'b', 'Seguimos', 102, 'continue').text, 'Seguimos');
});
test('sequential block before second consent prevents reveal and further chat', () => {
  const { state, match } = fixture(); talk(state, match);
  consentPhoto(state, match.id, 'a', 101); block(state, 'b', 'a');
  assert.throws(() => consentPhoto(state, match.id, 'b', 102), code('MATCH_INACTIVE'));
  assert.throws(() => sendMessage(state, match.id, 'a', 'Oi', 102, 'blocked'), code('MATCH_INACTIVE'));
  assert.equal(getRevealView(state, match.id, 'a', 102).status, 'UNAVAILABLE');
  assert.equal(canViewPhoto(state, match.id, 'a', 'b', 102), false);
});
test('sequential block after second consent revokes reads; duplicate block stays idempotent', () => {
  const { state, match } = fixture(); talk(state, match);
  consentPhoto(state, match.id, 'a', 101); consentPhoto(state, match.id, 'b', 101);
  block(state, 'a', 'b'); block(state, 'a', 'b');
  assert.equal(state.blocks.length, 1);
  assert.equal(canViewPhoto(state, match.id, 'b', 'a', 102), false);
  assert.throws(() => like(state, 'b', 'a', 102), code('BLOCKED'));
});
test('unmatch cannot be reactivated by a repeated like or old consent', () => {
  const { state, match } = fixture(); talk(state, match);
  unmatch(state, match.id, 'b');
  assert.throws(() => like(state, 'a', 'b', 101), code('MATCH_INACTIVE'));
  assert.throws(() => consentPhoto(state, match.id, 'a', 101), code('MATCH_INACTIVE'));
});
test('outsiders cannot message, consent, unmatch or inspect private views', () => {
  const { state, match } = fixture(); talk(state, match);
  assert.throws(() => sendMessage(state, match.id, 'c', 'Oi', 101, 'x'), code('MATCH_NOT_FOUND'));
  assert.throws(() => consentPhoto(state, match.id, 'c', 101), code('MATCH_NOT_FOUND'));
  assert.throws(() => getRevealView(state, match.id, 'c', 101), code('MATCH_NOT_FOUND'));
  assert.throws(() => unmatch(state, match.id, 'c'), code('MATCH_NOT_FOUND'));
  assert.equal(canViewPhoto(state, match.id, 'c', 'a', 101), false);
});
test('consents never carry between matches, and state round-trips as JSON', () => {
  const { state, match } = fixture(); talk(state, match);
  consentPhoto(state, match.id, 'a', 101); consentPhoto(state, match.id, 'b', 101);
  like(state, 'a', 'c', 101); const other = like(state, 'c', 'a', 101);
  assert.equal(getRevealView(state, other.id, 'a', 10000).ownConsent, false);
  const clone = structuredClone(state);
  assert.deepEqual(JSON.parse(JSON.stringify(clone)), state);
  assert.equal(canViewPhoto(clone, match.id, 'a', 'b', 102), true);
  changePhoto(clone, 'a');
  assert.equal(canViewPhoto(clone, match.id, 'a', 'b', 102), false);
  assert.equal(canViewPhoto(state, match.id, 'a', 'b', 102), true);
});

test('consent cannot predate the latest message even when the wait window is zero', () => {
  const { state, match } = fixture({ waitMs: 0, turnsRequired: 1 });
  sendMessage(state, match.id, 'a', 'Um livro', 1, 'first');
  sendMessage(state, match.id, 'b', 'Outro livro', 2, 'reply');
  sendMessage(state, match.id, 'a', 'Continuamos', 10, 'latest');
  assert.throws(() => consentPhoto(state, match.id, 'a', 2), code('INVALID_TIME'));
  assert.equal(match.consents.length, 0);
  assert.equal(consentPhoto(state, match.id, 'a', 10).ownConsent, true);
});

test('reads and timed commands reject clocks earlier than either current consent', () => {
  const { state, match } = fixture({ waitMs: 0, turnsRequired: 1 });
  sendMessage(state, match.id, 'a', 'Um livro', 1, 'first');
  sendMessage(state, match.id, 'b', 'Outro livro', 2, 'reply');
  consentPhoto(state, match.id, 'a', 100);
  assert.throws(() => consentPhoto(state, match.id, 'b', 99), code('INVALID_TIME'));
  consentPhoto(state, match.id, 'b', 101);
  assert.throws(() => getRevealView(state, match.id, 'a', 2), code('INVALID_TIME'));
  assert.throws(() => canViewPhoto(state, match.id, 'a', 'b', 100), code('INVALID_TIME'));
  assert.throws(() => sendMessage(state, match.id, 'a', 'Antes', 100, 'back'), code('INVALID_TIME'));
  assert.throws(() => like(state, 'a', 'b', 100), code('INVALID_TIME'));
  assert.equal(canViewPhoto(state, match.id, 'a', 'b', 101), true);
});
