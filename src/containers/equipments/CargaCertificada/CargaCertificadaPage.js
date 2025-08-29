import React, { useState } from 'react';
import { Box, Typography, Chip, LinearProgress } from '@material-ui/core';
import WarehouseSearch from './WarehouseSearch';
import StandardItemsTable from './StandardItemsTable';
import { Backend } from '../../../data';
import { Auth } from '../../../services/Auth';

const STANDARD_ITEMS_MOCK = {
  standardId: 2,
  model: [
    {id:23,idModel:6,minQty:0,maxQty:5,createdAt:'2025-08-25T21:56:41Z',modelName:'DCX700'},
    {id:25,idModel:4,minQty:0,maxQty:5,createdAt:'2025-08-25T21:56:41Z',modelName:'EG2482'},
    {id:21,idModel:1,minQty:10,maxQty:25,createdAt:'2025-08-25T21:56:41Z',modelName:'FAST5670'},
    {id:22,idModel:5,minQty:0,maxQty:5,createdAt:'2025-08-25T21:56:41Z',modelName:'FAST5670'},
    {id:24,idModel:7,minQty:0,maxQty:5,createdAt:'2025-08-25T21:56:41Z',modelName:'UIW4054MIL'}
  ],
  material: [
    {id:9,idMaterial:2,minQty:1,maxQty:10,createdAt:'2025-08-25T21:56:41Z',materialName:null}
  ],
  group: [
    {
      id:10,idGroup:1,minQty:2,maxQty:4,createdAt:'2025-08-26T20:33:28Z',
      groupName:'HD',linkedModelsCount:2,
      linkedModels:[{idModel:2,modelName:'WIFI DOCSIS 3.0'},{idModel:3,modelName:'DCX700'}]
    }
  ],
  counts:{model:5,material:1,group:1}
};

const CargaCertificadaPage = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null); // carrito
  const [selectedStorageId, setSelectedStorageId] = useState(
    Number(window.localStorage.getItem('certifiedLoad.storageId')) || null
  );

  const [items, setItems] = useState({ models: [], groups: [], materials: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    if (!selectedWarehouse) return;
    // Normaliza: trata undefined, null, "null", "" y NaN como SIN estándar
    const raw = selectedWarehouse.idStandar;
    const normalized =
      raw === undefined || raw === null || raw === '' || raw === 'null'
        ? null
        : raw;

    if (normalized === null) {
      setItems({ models: [], groups: [], materials: [] });
      setError('Este carrito no tiene estándar asociado.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${Backend.equipments.standardLoad.url}/${selectedWarehouse.idStandar}/items`,
        Auth.authorize()
      );
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setItems({
        models: data.model || [],
        groups: data.group || [],
        materials: data.material || [],
      });
    } catch (e) {
      console.error(e);
      setError('Fallo obteniendo ítems, usando datos locales');
      setItems({
        models: STANDARD_ITEMS_MOCK.model,
        groups: STANDARD_ITEMS_MOCK.group,
        materials: STANDARD_ITEMS_MOCK.material,
      });
    } finally {
      setLoading(false);
    }
  };

  const showStartButton = selectedWarehouse?.idStandar === 2;

  const handleStart = async () => {
    if (!selectedWarehouse) return;
    const auth = Auth.authorize();
    try {
      await fetch(Backend.equipments.certifiedLoad.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(auth.headers || {}) },
        body: JSON.stringify({
          warehouse_id: selectedStorageId,
          car_id: selectedWarehouse.id,
        }),
      });
    } catch (e) {
      console.error(e);
    }
    await fetchItems();
  };

  const handleExport = (materialsRead) => {
    if (!selectedWarehouse) return;
    const payload = {
      warehouseId: selectedWarehouse.id,
      idStandar: selectedWarehouse.idStandar,
      storageId: selectedStorageId,
      materialsRead
    };
    console.log(payload);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Carga Certificada</Typography>

      <WarehouseSearch
        onSelect={setSelectedWarehouse}
        selectedWarehouse={selectedWarehouse}
        selectedStorageId={selectedStorageId}
        onStorageSelect={(id /*, storageObj */) => setSelectedStorageId(id)}
        showStartButton={showStartButton}
        onStart={handleStart}
      />

      {selectedWarehouse && (
        <Box mt={2} mb={2}>
          <Typography variant="h6">Detalle del carrito</Typography>
          <Typography>Nombre: {selectedWarehouse.name}</Typography>
          <Typography>SAP: {selectedWarehouse.resellerCode}</Typography>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <Typography>Tipo:</Typography>
            <Chip label={selectedWarehouse.type} size="small" />
          </Box>
          <Typography>idStandar: {selectedWarehouse.idStandar}</Typography>
          {selectedStorageId != null && (
            <Typography>Bodega seleccionada (id): {selectedStorageId}</Typography>
          )}
        </Box>
      )}

      {loading && <LinearProgress />}
      {!loading && error && (
        <Box mb={2} p={2} borderRadius={4} bgcolor="#fdecea" color="#b71c1c">
          {error}
        </Box>
      )}
      {!loading && !error && selectedWarehouse && (
        <StandardItemsTable
          models={items.models}
          groups={items.groups}
          materials={items.materials}
          onExport={handleExport}
        />
      )}
    </Box>
  );
};

export default CargaCertificadaPage;
