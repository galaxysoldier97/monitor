import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress
} from '@material-ui/core';
import { Backend } from '../../../data';
import { Auth } from '../../../services/Auth';

// Example warehouses used as fallback when API fails
const WAREHOUSE_MOCK = {
  content: [
    {"id":1,"name":"CAPA80","resellerCode":"CAPA","type":"CAR","idStandar":1,"status":"enable"},
    {"id":2,"name":"Bodega Interior","resellerCode":"TIGO","type":"STORAGE","idStandar":2,"status":"enable"},
    {"id":3,"name":"Bodega Woden","resellerCode":"Woden","type":"STORAGE","idStandar":3,"status":"enable"},
    {"id":4,"name":"CAPA81","resellerCode":"capa1","type":"CAR","idStandar":4,"status":"enable"}
  ]
};

const WarehouseSearch = ({ onSelect, selectedWarehouse }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [type, setType] = useState('CAR');

  // fetch warehouses once
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

  // debounce search query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // clear selection when type changes and current selection does not match
  useEffect(() => {
    if (selectedWarehouse && selectedWarehouse.type !== type) {
      onSelect && onSelect(null);
    }
  }, [type]);

  const filtered = useMemo(() =>
    warehouses
      .filter(w => w.type === type)
      .filter(w => w.name.toLowerCase().startsWith(debouncedQuery.toLowerCase()))
  , [warehouses, type, debouncedQuery]);

  return (
    <Box>
      <Box display="flex" mb={2} style={{ gap: 16 }}>
        <TextField
          label="Buscar carrito"
          value={query}
          onChange={e => setQuery(e.target.value)}
          size="small"
        />
        <Select value={type} onChange={e => setType(e.target.value)} size="small">
          <MenuItem value="CAR">CAR</MenuItem>
          <MenuItem value="STORAGE">STORAGE</MenuItem>
        </Select>
      </Box>
      {loading && <LinearProgress />}
      {!loading && error && (
        <Box
          mb={2}
          p={2}
          borderRadius={4}
          bgcolor="#fdecea"
          color="#b71c1c"
        >
          {error}
        </Box>
      )}
      {!loading && (
        <TableContainer component={Paper} style={{ maxHeight: 240 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Reseller</TableCell>
                <TableCell>Tipo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(w => (
                <TableRow
                  hover
                  key={w.id}
                  onClick={() => onSelect && onSelect(w)}
                  selected={selectedWarehouse && selectedWarehouse.id === w.id}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.resellerCode}</TableCell>
                  <TableCell>{w.type}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">Sin resultados</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default WarehouseSearch;
