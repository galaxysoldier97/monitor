import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from '@material-ui/core';
import GroupRow from './GroupRow';

// validate float with max decimals
export const isValidFloat = (value, maxDecimals = 2) => {
  if (value === '') return true;
  const regex = new RegExp(`^\\d*(\\.\\d{0,${maxDecimals}})?$`);
  return regex.test(value);
};

const StandardItemsTable = ({ models = [], groups = [], materials = [], onExport }) => {
  const [reads, setReads] = useState({});
  const [expanded, setExpanded] = useState({});

  const handleExpand = id => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReadChange = (item, value) => {
    setReads(prev => ({ ...prev, [item.id]: { id: item.id, idMaterial: item.idMaterial, readQty: value } }));
  };

  const getError = item => {
    const entry = reads[item.id];
    const value = entry ? entry.readQty : '';
    if (value === '') return '';
    if (!isValidFloat(value)) return 'Número inválido';
    if (parseFloat(value) > item.maxQty) return 'Supera máximo';
    return '';
  };

  const exportData = () => {
    const materialsRead = Object.values(reads)
      .filter(r => r.readQty !== '' && isValidFloat(r.readQty))
      .map(r => ({ id: r.id, idMaterial: r.idMaterial, readQty: parseFloat(r.readQty) }));
    onExport && onExport(materialsRead);
  };

  const hasRows = models.length + groups.length + materials.length > 0;

  return (
    <Box>
      <TableContainer component={Paper} style={{ maxHeight: 400, marginBottom: 16 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Disponible (Mínimo)</TableCell>
              <TableCell>Por Cargar (Máximo)</TableCell>
              <TableCell>Leído/Cargado</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map(m => (
              <TableRow key={`model-${m.id}`}>
                <TableCell>{m.modelName}</TableCell>
                <TableCell>{m.minQty}</TableCell>
                <TableCell>{m.maxQty}</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            ))}
            {groups.map(g => (
              <React.Fragment key={`group-${g.id}`}>
                <TableRow>
                  <TableCell>{g.groupName}</TableCell>
                  <TableCell>{g.minQty}</TableCell>
                  <TableCell>{g.maxQty}</TableCell>
                  <TableCell />
                  <TableCell>
                    <Button size="small" onClick={() => handleExpand(g.id)}>Ver</Button>
                  </TableCell>
                </TableRow>
                {expanded[g.id] && <GroupRow group={g} />}
              </React.Fragment>
            ))}
            {materials.map(mat => {
              const value = reads[mat.id]?.readQty || '';
              const err = getError(mat);
              return (
                <TableRow key={`material-${mat.id}`}>
                  <TableCell>{mat.materialName || 'Material sin nombre'}</TableCell>
                  <TableCell>{mat.minQty}</TableCell>
                  <TableCell>{mat.maxQty}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={value}
                      onChange={e => handleReadChange(mat, e.target.value)}
                      size="small"
                      inputProps={{ step: 0.1, min: 0 }}
                      error={Boolean(err)}
                      helperText={err}
                    />
                  </TableCell>
                  <TableCell />
                </TableRow>
              );
            })}
            {!hasRows && (
              <TableRow>
                <TableCell colSpan={5} align="center">Sin resultados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {hasRows && (
        <Box textAlign="right">
          <Button variant="contained" onClick={exportData}>Exportar cambios</Button>
        </Box>
      )}
    </Box>
  );
};

export default StandardItemsTable;
