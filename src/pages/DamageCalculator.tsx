import { useState, useMemo } from 'react';
import {
  Box, Container, Typography, Paper, Grid,
  Autocomplete, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Chip, Alert, Divider,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  calculate, Pokemon, Move, Field, Side, Generations,
  MOVES, ABILITIES, ITEMS, NATURES, MEGA_STONES,
} from '@smogon/calc';
import type { StatID } from '@smogon/calc';
import { CHAMPIONS_ALL, CHAMPIONS_MEGAS } from '../data/championsRoster';

type StatusName = 'slp' | 'psn' | 'brn' | 'frz' | 'par' | 'tox';
type Weather = 'Sand' | 'Sun' | 'Rain' | 'Hail' | 'Snow' | 'Harsh Sunshine' | 'Heavy Rain' | 'Strong Winds';
type Terrain = 'Electric' | 'Grassy' | 'Psychic' | 'Misty';

// ─── Static data ─────────────────────────────────────────────────────────────

const gen9 = Generations.get(9);
const gen7 = Generations.get(7);

const ALL_SPECIES = CHAMPIONS_ALL;

const MOVE_LIST = Object.keys(MOVES[9]).filter(m => m !== '(No Move)').sort();
const ABILITY_LIST = [...new Set(Object.values(ABILITIES[9]).filter((v): v is string => typeof v === 'string'))].sort();
const ITEM_LIST = [...new Set(Object.values(ITEMS[9]).filter((v): v is string => typeof v === 'string'))].sort();
const NATURE_LIST = Object.keys(NATURES).sort();
const ALL_ITEMS = [...new Set([...ITEM_LIST, ...Object.keys(MEGA_STONES)])].sort();

function isMegaForm(species: string) {
  return CHAMPIONS_MEGAS.includes(species);
}

const WEATHER_OPTIONS = ['None', 'Sun', 'Rain', 'Sand', 'Snow'] as const;
const TERRAIN_OPTIONS = ['None', 'Electric', 'Grassy', 'Misty', 'Psychic'] as const;

const STATUS_MAP: Record<string, StatusName | undefined> = {
  '': undefined,
  'Burn': 'brn',
  'Paralysis': 'par',
  'Poison': 'psn',
  'Toxic': 'tox',
  'Sleep': 'slp',
  'Freeze': 'frz',
};

const STATS: StatID[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_LABELS: Record<StatID, string> = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };

// ─── Types ────────────────────────────────────────────────────────────────────

interface PokemonConfig {
  species: string;
  level: number;
  ability: string;
  item: string;
  nature: string;
  evs: Record<StatID, number>;
  ivs: Record<StatID, number>;
  boosts: Record<StatID, number>;
  status: string;
}

interface FieldConfig {
  weather: typeof WEATHER_OPTIONS[number];
  terrain: typeof TERRAIN_OPTIONS[number];
  isGravity: boolean;
  format: 'singles' | 'doubles';
  attackerSide: { isReflect: boolean; isLightScreen: boolean; isAuroraVeil: boolean };
  defenderSide: { isReflect: boolean; isLightScreen: boolean; isAuroraVeil: boolean; isSR: boolean };
}

const defaultEVs = (): Record<StatID, number> => ({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
const defaultIVs = (): Record<StatID, number> => ({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 });
const defaultBoosts = (): Record<StatID, number> => ({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });

function defaultPokemon(species: string): PokemonConfig {
  return { species, level: 50, ability: '', item: '', nature: 'Hardy', evs: defaultEVs(), ivs: defaultIVs(), boosts: defaultBoosts(), status: '' };
}

function defaultField(): FieldConfig {
  return {
    weather: 'None', terrain: 'None', isGravity: false, format: 'singles',
    attackerSide: { isReflect: false, isLightScreen: false, isAuroraVeil: false },
    defenderSide: { isReflect: false, isLightScreen: false, isAuroraVeil: false, isSR: false },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPokemon(g: ReturnType<typeof Generations.get>, cfg: PokemonConfig): Pokemon {
  return new Pokemon(g, cfg.species, {
    level: cfg.level,
    ability: cfg.ability || undefined,
    item: cfg.item || undefined,
    nature: cfg.nature,
    evs: cfg.evs,
    ivs: cfg.ivs,
    boosts: cfg.boosts,
    status: STATUS_MAP[cfg.status],
  });
}

function buildField(cfg: FieldConfig): Field {
  const weather = cfg.weather !== 'None' ? cfg.weather as Weather : undefined;
  const terrain = cfg.terrain !== 'None' ? cfg.terrain as Terrain : undefined;
  return new Field({
    weather,
    terrain,
    isGravity: cfg.isGravity,
    gameType: cfg.format === 'doubles' ? 'Doubles' : 'Singles',
    attackerSide: new Side(cfg.attackerSide),
    defenderSide: new Side(cfg.defenderSide),
  });
}

// ─── ToggleChip ──────────────────────────────────────────────────────────────

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Chip
      label={label}
      onClick={onClick}
      color={active ? 'primary' : 'default'}
      variant={active ? 'filled' : 'outlined'}
      size="small"
      sx={{ cursor: 'pointer' }}
    />
  );
}

// ─── PokemonPanel ─────────────────────────────────────────────────────────────

function PokemonPanel({ config, onChange, label }: {
  config: PokemonConfig;
  onChange: (cfg: PokemonConfig) => void;
  label: string;
}) {
  const [showIVs, setShowIVs] = useState(false);
  const [showBoosts, setShowBoosts] = useState(false);

  function set<K extends keyof PokemonConfig>(key: K, value: PokemonConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  function setStat(group: 'evs' | 'ivs' | 'boosts', stat: StatID, value: number) {
    onChange({ ...config, [group]: { ...config[group], [stat]: value } });
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>{label}</Typography>

      <Autocomplete
        options={ALL_SPECIES}
        value={config.species}
        onChange={(_, v) => v && set('species', v)}
        renderInput={(params) => <TextField {...params} label="Pokémon" size="small" />}
        sx={{ mb: 1.5 }}
      />

      {isMegaForm(config.species) && (
        <Alert severity="info" sx={{ mb: 1.5, py: 0.5, fontSize: '0.75rem' }}>
          Mega Evolution: uses Gen 7 data with Gen 9 mechanics.
        </Alert>
      )}

      <TextField
        label="Level"
        type="number"
        size="small"
        fullWidth
        value={config.level}
        onChange={e => set('level', Math.max(1, Math.min(100, Number(e.target.value))))}
        slotProps={{ htmlInput: { min: 1, max: 100 } }}
        sx={{ mb: 1.5 }}
      />

      <Autocomplete
        options={ABILITY_LIST}
        value={config.ability}
        onChange={(_, v) => set('ability', v ?? '')}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Ability" size="small" />}
        sx={{ mb: 1.5 }}
      />

      <Autocomplete
        options={ALL_ITEMS}
        value={config.item}
        onChange={(_, v) => set('item', v ?? '')}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Item" size="small" />}
        sx={{ mb: 1.5 }}
      />

      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <InputLabel>Nature</InputLabel>
        <Select value={config.nature} label="Nature" onChange={e => set('nature', e.target.value)}>
          {NATURE_LIST.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <InputLabel>Status</InputLabel>
        <Select value={config.status} label="Status" onChange={e => set('status', e.target.value)}>
          {Object.keys(STATUS_MAP).map(s => (
            <MenuItem key={s} value={s}>{s || 'None'}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 1 }} />

      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>EVs</Typography>
      <Grid container spacing={1} sx={{ mt: 0.5, mb: 1 }}>
        {STATS.map(stat => (
          <Grid key={stat} size={4}>
            <TextField
              label={STAT_LABELS[stat]}
              type="number"
              size="small"
              fullWidth
              value={config.evs[stat]}
              onChange={e => setStat('evs', stat, Math.max(0, Math.min(252, Number(e.target.value))))}
              slotProps={{ htmlInput: { min: 0, max: 252 } }}
            />
          </Grid>
        ))}
      </Grid>

      <Button size="small" onClick={() => setShowIVs(v => !v)} sx={{ mb: 0.5 }}>
        {showIVs ? 'Hide' : 'Show'} IVs
      </Button>
      {showIVs && (
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {STATS.map(stat => (
            <Grid key={stat} size={4}>
              <TextField
                label={STAT_LABELS[stat]}
                type="number"
                size="small"
                fullWidth
                value={config.ivs[stat]}
                onChange={e => setStat('ivs', stat, Math.max(0, Math.min(31, Number(e.target.value))))}
                slotProps={{ htmlInput: { min: 0, max: 31 } }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Button size="small" onClick={() => setShowBoosts(v => !v)}>
        {showBoosts ? 'Hide' : 'Show'} Boosts
      </Button>
      {showBoosts && (
        <Grid container spacing={1} sx={{ mt: 0.5 }}>
          {STATS.filter(s => s !== 'hp').map(stat => (
            <Grid key={stat} size={4}>
              <TextField
                label={STAT_LABELS[stat]}
                type="number"
                size="small"
                fullWidth
                value={config.boosts[stat]}
                onChange={e => setStat('boosts', stat, Math.max(-6, Math.min(6, Number(e.target.value))))}
                slotProps={{ htmlInput: { min: -6, max: 6 } }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

// ─── FieldPanel ───────────────────────────────────────────────────────────────

function FieldPanel({ field, onChange }: { field: FieldConfig; onChange: (f: FieldConfig) => void }) {
  function toggleSide(side: 'attackerSide' | 'defenderSide', key: string) {
    onChange({ ...field, [side]: { ...field[side], [key]: !field[side][key as keyof typeof field.attackerSide] } });
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Field Conditions</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Weather</InputLabel>
            <Select
              value={field.weather}
              label="Weather"
              onChange={e => onChange({ ...field, weather: e.target.value as typeof field.weather })}
            >
              {WEATHER_OPTIONS.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Terrain</InputLabel>
            <Select
              value={field.terrain}
              label="Terrain"
              onChange={e => onChange({ ...field, terrain: e.target.value as typeof field.terrain })}
            >
              {TERRAIN_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Format</InputLabel>
            <Select
              value={field.format}
              label="Format"
              onChange={e => onChange({ ...field, format: e.target.value as 'singles' | 'doubles' })}
            >
              <MenuItem value="singles">Singles</MenuItem>
              <MenuItem value="doubles">Doubles</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <ToggleChip label="Gravity" active={field.isGravity} onClick={() => onChange({ ...field, isGravity: !field.isGravity })} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>Attacker's Side</Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <ToggleChip label="Reflect" active={field.attackerSide.isReflect} onClick={() => toggleSide('attackerSide', 'isReflect')} />
            <ToggleChip label="Light Screen" active={field.attackerSide.isLightScreen} onClick={() => toggleSide('attackerSide', 'isLightScreen')} />
            <ToggleChip label="Aurora Veil" active={field.attackerSide.isAuroraVeil} onClick={() => toggleSide('attackerSide', 'isAuroraVeil')} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>Defender's Side</Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <ToggleChip label="Reflect" active={field.defenderSide.isReflect} onClick={() => toggleSide('defenderSide', 'isReflect')} />
            <ToggleChip label="Light Screen" active={field.defenderSide.isLightScreen} onClick={() => toggleSide('defenderSide', 'isLightScreen')} />
            <ToggleChip label="Aurora Veil" active={field.defenderSide.isAuroraVeil} onClick={() => toggleSide('defenderSide', 'isAuroraVeil')} />
            <ToggleChip label="Stealth Rock" active={field.defenderSide.isSR} onClick={() => toggleSide('defenderSide', 'isSR')} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

// ─── ResultDisplay ────────────────────────────────────────────────────────────

function ResultDisplay({ attackerCfg, defenderCfg, moveName, fieldCfg }: {
  attackerCfg: PokemonConfig;
  defenderCfg: PokemonConfig;
  moveName: string;
  fieldCfg: FieldConfig;
}) {
  const result = useMemo(() => {
    if (!moveName) return null;
    try {
      const hasMega = isMegaForm(attackerCfg.species) || isMegaForm(defenderCfg.species);
      const g = hasMega ? gen7 : gen9;
      const attacker = buildPokemon(g, attackerCfg);
      const defender = buildPokemon(g, defenderCfg);
      const move = new Move(g, moveName);
      const field = buildField(fieldCfg);
      return { calc: calculate(g, attacker, defender, move, field), error: null };
    } catch (e) {
      return { calc: null, error: String(e) };
    }
  }, [attackerCfg, defenderCfg, moveName, fieldCfg]);

  if (!moveName) {
    return (
      <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">Select a move to calculate damage.</Typography>
      </Paper>
    );
  }

  if (!result) return null;

  if (result.error) return <Alert severity="error">{result.error}</Alert>;

  const { calc } = result;
  if (!calc) return null;

  const dmg = calc.damage as number[];
  if (!dmg || dmg.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Alert severity="info" sx={{ mb: 1 }}>No damage (status move or immune).</Alert>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{calc.desc()}</Typography>
      </Paper>
    );
  }

  const min = dmg[0];
  const max = dmg[dmg.length - 1];
  const defHP = calc.defender.stats.hp;
  const minPct = ((min / defHP) * 100).toFixed(1);
  const maxPct = ((max / defHP) * 100).toFixed(1);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Result</Typography>
      <Box sx={{ bgcolor: 'primary.main', color: '#fff', borderRadius: 1, px: 2, py: 1.5, mb: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {min}–{max} ({minPct}%–{maxPct}%)
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
        Damage Rolls (16)
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {dmg.map((d, i) => (
          <Chip key={i} label={d} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }} />
        ))}
      </Box>

      <Divider sx={{ mb: 1 }} />
      <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-word', color: 'text.secondary' }}>
        {calc.desc()}
      </Typography>
    </Paper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DamageCalculator() {
  const [attacker, setAttacker] = useState<PokemonConfig>(defaultPokemon('Garchomp'));
  const [defender, setDefender] = useState<PokemonConfig>(defaultPokemon('Toxapex'));
  const [moveName, setMoveName] = useState('Earthquake');
  const [field, setField] = useState<FieldConfig>(defaultField());

  function swap() {
    setAttacker(defender);
    setDefender(attacker);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Damage Calculator</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Gen 9 mechanics · Mega Evolution support included
      </Typography>

      <FieldPanel field={field} onChange={setField} />

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Autocomplete
          options={MOVE_LIST}
          value={moveName}
          onChange={(_, v) => v && setMoveName(v)}
          renderInput={(params) => <TextField {...params} label="Move" size="small" />}
        />
      </Paper>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <PokemonPanel config={attacker} onChange={setAttacker} label="Attacker" />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', pt: { md: 8 } }}>
          <Button variant="outlined" onClick={swap} startIcon={<SwapHorizIcon />}>
            Swap
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <PokemonPanel config={defender} onChange={setDefender} label="Defender" />
        </Grid>
      </Grid>

      <ResultDisplay
        attackerCfg={attacker}
        defenderCfg={defender}
        moveName={moveName}
        fieldCfg={field}
      />
    </Container>
  );
}
