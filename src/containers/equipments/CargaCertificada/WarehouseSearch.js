import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  LinearProgress,
  Button,
} from '@material-ui/core';
import { Backend } from '../../../data';
import { Auth } from '../../../services/Auth';

// Example warehouses used as fallback when API fails
const WAREHOUSE_MOCK = {
  content: [
    { id: 1, name: 'CAPA80', resellerCode: 'CAPA', type: 'CAR', idStandar: 1, status: 'enable' },
    { id: 2, name: 'Bodega Interior', resellerCode: 'TIGO', type: 'STORAGE', idStandar: 2, status: 'enable' },
    { id: 3, name: 'Bodega Woden', resellerCode: 'Woden', type: 'STORAGE', idStandar: 3, status: 'enable' },
    { id: 4, name: 'CAPA81', resellerCode: 'capa1', type: 'CAR', idStandar: 4, status: 'enable' },
  ],
};

const WarehouseSearch = ({
  selectedWarehouse,
  onSelect,
  selectedStorageId,
  onStorageSelect,
  showStartButton,
  onStart,
}) => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      try {
        const res = await fetch(Backend.equipments.warehouses.url, Auth.authorize());
        if (!res.ok) throw new Error('Error al cargar');
        const data = await res.json();
        setWarehouses(data.content || []);
      } catch (e) {
        console.error(e);
        setError('Fallo obteniendo carritos, usando datos locales');
        setWarehouses(WAREHOUSE_MOCK.content);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const storages = warehouses.filter(w => w.type === 'STORAGE');
  const cars = warehouses.filter(w => w.type === 'CAR');

  return (
    <Box mb={2} display="flex" alignItems="center" style={{ gap: 16 }}>
      <TextField
        select
        label="Bodega"
        value={selectedStorageId ?? ''}
        onChange={e => onStorageSelect && onStorageSelect(Number(e.target.value))}
        size="small"
        variant="outlined"
      >
        {storages.map(s => (
          <MenuItem key={s.id} value={s.id}>
            {s.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Carrito"
        value={selectedWarehouse ? selectedWarehouse.id : ''}
        onChange={e => {
          const w = cars.find(c => c.id === Number(e.target.value));
          onSelect && onSelect(w || null);
        }}
        size="small"
        variant="outlined"
      >
        {cars.map(c => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
      {showStartButton && (
        <Button variant="contained" color="primary" onClick={onStart}>
          Iniciar
        </Button>
      )}
      {loading && <LinearProgress style={{ flex: 1 }} />}
      {!loading && error && (
        <Box color="#b71c1c">{error}</Box>
      )}
    </Box>
  );
};

export default WarehouseSearch;
