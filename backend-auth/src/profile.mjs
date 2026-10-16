const options = {
  identity: ['Mulher', 'Homem', 'Pessoa não binária', 'Prefiro não dizer'],
  interestedIn: ['Mulheres', 'Homens', 'Pessoas não binárias', 'Todos'],
  intention: ['Um namoro', 'Namoro, sem pressa', 'Algo casual', 'Amizades', 'Conhecer pessoas', 'Ainda não sei'],
  genres: ['Ficção brasileira', 'Romance', 'Fantasia', 'Mistério', 'Poesia', 'Biografias', 'Não ficção', 'Quadrinhos'],
  readingHabits: ['No caminho', 'Antes de dormir', 'No fim de semana', 'Quando sobra um tempo', 'Com meu clube do livro'],
  literaryDates: ['Garimpar um sebo', 'Passear numa livraria', 'Tomar um café e falar de livros', 'Ler o mesmo livro'],
};
const fields = ['name', 'birthDate', 'city', 'identity', 'interestedIn', 'intention', 'genres', 'books', 'bio', 'readingHabits', 'literaryDates', 'bookRecommendation'];
// Curated beta IDs only. A future catalogue integration needs its own validation contract.
const bookIds = ['estrela', 'avesso', 'torto', 'rio', 'vegetariana', 'cegueira'];
const invalid = () => { throw new Error('INVALID_PROFILE'); };
function text(value, min, max) {
  if (typeof value !== 'string' || value.trim().length < min || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) invalid();
  return value.trim();
}
function list(value, allowed, min = 0) {
  if (!Array.isArray(value) || value.length < min || value.length > allowed.length || new Set(value).size !== value.length || value.some(item => !allowed.includes(item))) invalid();
  return [...value];
}
export function validateProfile(value, today = new Date()) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== fields.length || Object.keys(value).some(key => !fields.includes(key))) invalid();
  const birthDate = text(value.birthDate, 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) invalid();
  const date = new Date(`${birthDate}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== birthDate || date.getUTCFullYear() < 1900) invalid();
  const age = today.getUTCFullYear() - date.getUTCFullYear() - (today.toISOString().slice(5, 10) < birthDate.slice(5) ? 1 : 0);
  if (age < 18) invalid();
  if (!options.identity.includes(value.identity) || !options.intention.includes(value.intention)) invalid();
  if (!Array.isArray(value.books) || value.books.length !== 3 || new Set(value.books).size !== 3 || value.books.some(book => !bookIds.includes(book))) invalid();
  const interestedIn = list(value.interestedIn, options.interestedIn, 1);
  if (interestedIn.includes('Todos') && interestedIn.length !== 1) invalid();
  return {
    name: text(value.name, 2, 40), birthDate, city: text(value.city, 0, 60),
    identity: value.identity, interestedIn, intention: value.intention,
    genres: list(value.genres, options.genres, 1), books: [...value.books],
    bio: text(value.bio, 0, 500),
    readingHabits: list(value.readingHabits, options.readingHabits),
    literaryDates: list(value.literaryDates, options.literaryDates),
    bookRecommendation: text(value.bookRecommendation, 0, 200),
  };
}

export function createProfileRepository(pool) {
  return {
    async get(userId) {
      const { rows } = await pool.query('SELECT metadata, updated_at FROM trelele_profile WHERE user_id = $1', [userId]);
      return rows.length ? { metadata: rows[0].metadata, updatedAt: rows[0].updated_at } : null;
    },
    async put(userId, metadata) {
      const { rows } = await pool.query(`INSERT INTO trelele_profile (user_id, metadata) VALUES ($1, $2::jsonb)
        ON CONFLICT (user_id) DO UPDATE SET metadata = EXCLUDED.metadata, updated_at = now()
        RETURNING metadata, updated_at`, [userId, JSON.stringify(metadata)]);
      return { metadata: rows[0].metadata, updatedAt: rows[0].updated_at };
    },
  };
}
