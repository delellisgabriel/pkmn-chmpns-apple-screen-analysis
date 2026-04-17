import { useState } from 'react';
import { Box, Container, Typography, Paper, Divider, Stack } from '@mui/material';
import TypeBadge from '../components/TypeBadge';
import type { PokemonType } from '../data/typeChart';
import { ALL_TYPES, getDefensiveMatchups } from '../data/typeChart';

const GROUPS = [
  { key: '4',    label: '4×',  bg: '#FF0000', color: '#fff', desc: 'Takes 4× damage' },
  { key: '2',    label: '2×',  bg: '#FF7F00', color: '#fff', desc: 'Takes 2× damage' },
  { key: '0.5',  label: '½×',  bg: '#9DB7F5', color: '#fff', desc: 'Takes ½× damage' },
  { key: '0.25', label: '¼×',  bg: '#4488E8', color: '#fff', desc: 'Takes ¼× damage' },
  { key: '0',    label: '0×',  bg: '#212121', color: '#fff', desc: 'Immune' },
  { key: '1',    label: '1×',  bg: '#e0e0e0', color: '#333', desc: 'Normal damage' },
];

export default function TypeCalculator() {
  const [selected, setSelected] = useState<PokemonType[]>([]);

  function toggle(type: PokemonType) {
    setSelected(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      if (prev.length >= 2) return [prev[1], type];
      return [...prev, type];
    });
  }

  const matchups = selected.length > 0 ? getDefensiveMatchups(selected) : null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Type Weakness Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select up to 2 types to see defensive matchups.
      </Typography>

      {/* Type selector */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {ALL_TYPES.map(type => (
            <TypeBadge
              key={type}
              type={type}
              onClick={() => toggle(type)}
              selected={selected.includes(type)}
            />
          ))}
        </Box>

        {selected.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Defending as:</Typography>
            {selected.map(t => <TypeBadge key={t} type={t} />)}
          </Box>
        )}
      </Paper>

      {/* Results */}
      {matchups && (
        <Stack spacing={2}>
          {GROUPS.filter(g => matchups[g.key].length > 0).map(g => (
            <Paper key={g.key} variant="outlined" sx={{ overflow: 'hidden' }}>
              <Box sx={{ bgcolor: g.bg, px: 2, py: 0.75, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: g.color, minWidth: 40 }}>
                  {g.label}
                </Typography>
                <Typography variant="caption" sx={{ color: g.color, opacity: 0.85 }}>
                  {g.desc}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {matchups[g.key].map(type => (
                  <TypeBadge key={type} type={type} size="small" />
                ))}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {!selected.length && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Select a type above to see matchups.</Typography>
        </Paper>
      )}
    </Container>
  );
}
