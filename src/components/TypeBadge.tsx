import { Chip } from '@mui/material';
import type { PokemonType } from '../data/typeChart';
import { TYPE_COLORS } from '../data/typeChart';

interface Props {
  type: PokemonType;
  size?: 'small' | 'medium';
  onClick?: () => void;
  selected?: boolean;
}

export default function TypeBadge({ type, size = 'medium', onClick, selected }: Props) {
  const bg = TYPE_COLORS[type];
  return (
    <Chip
      label={type}
      size={size}
      onClick={onClick}
      sx={{
        backgroundColor: bg,
        color: '#fff',
        fontWeight: 700,
        fontSize: size === 'small' ? '0.7rem' : '0.85rem',
        cursor: onClick ? 'pointer' : 'default',
        outline: selected ? '3px solid #000' : 'none',
        outlineOffset: '2px',
        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        '&:hover': onClick ? { opacity: 0.85 } : {},
      }}
    />
  );
}
