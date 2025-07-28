import React, { useEffect, useState } from 'react';
import { Snackbar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import SendIcon from '@material-ui/icons/Send';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { t } from 'mt-react-library/functions';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepEquipmentModelService from '../../../services/equipments/TecrepEquipmentModelService';
import TecrepEquipmentUploadService from '../../../services/equipments/TecrepEquipmentUploadService';
import { Auth } from '../../../services/Auth';
import { getDisplayedDate, getDisplayedDateTime } from '../../../helpers/commonHelper';

export default function EquipmentBulkUploadPage() {

    const [fileName, setFileName] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedModelId, setSelectedModelId] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [boxSn, setBoxSn] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingOrderId, setIsLoadingOrderId] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [isSendingEquipments, setIsSendingEquipments] = useState(false);
    const [orderUploadId, setOrderUploadId] = useState('');
    const [pendingMessage, setPendingMessage] = useState('');
    const [pendingResults, setPendingResults] = useState([]);
    const [emailSearch, setEmailSearch] = useState(Auth.getConnectedUser('email') || '');
    const [searchOrderId, setSearchOrderId] = useState('');

    const [pendingPage, setPendingPage] = useState(0);
    const pendingPageSize = 5;

    const [jobResults, setJobResults] = useState([]);
    const [jobMessage, setJobMessage] = useState('');
    const [jobPage, setJobPage] = useState(0);
    const jobPageSize = 5;
    const [jobSearchId, setJobSearchId] = useState('');
    const [isLoadingJobId, setIsLoadingJobId] = useState(false);
    const [isManualJobSearch, setIsManualJobSearch] = useState(false);

    // pagination for validation table
    const [validationPage, setValidationPage] = useState(0);
    const validationPageSize = 10;

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [selectedErrorDetails, setSelectedErrorDetails] = useState([]);



    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '1rem'
    };
    const thStyle = {
        border: '1px solid #ccc',
        padding: '0.5rem',
        background: '#f0f0f0',
        textAlign: 'left'
    };
    const tdStyle = {
        border: '1px solid #ccc',
        padding: '0.5rem'
    };
    const searchButtonStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    };
    const paginationButtonStyle = {
        padding: '0.25rem 0.75rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.name.toLowerCase().endsWith('.csv')) {
                setFileName(file.name);
                setIsUploaded(false);
            } else {
                setNotification({ show: true, message: t('equipment.upload.invalidFile') });
                e.target.value = null;
            }
        }
    };

    /* const handleProcess = async () => {
        const formData = new FormData();
        formData.append('file', document.querySelector('input[type="file"]').files[0]);
        formData.append('model_id', selectedModelId);

        console.log('Enviando archivo y modelo al backend...');
        const response = await TecrepEquipmentUploadService.uploadTempEquipments(formData);
        console.log('Respuesta del backend:', response);

    }; */

    const handleProcess = async () => {
        try {
            const fileInput = document.querySelector('input[type="file"]');
            if (!fileInput.files.length) return;

            setIsProcessing(true);

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('model_id', selectedModelId);
            const email = Auth.getConnectedUser('email');
            if (email) {
                formData.append('email', email);
            }

            console.log('Enviando archivo y modelo al backend...');
            const response = await TecrepEquipmentUploadService.uploadTempEquipments(formData);
            console.log('Respuesta del backend:', response);

            if (response && response.orderUploadId) {
                setOrderUploadId(response.orderUploadId);
                //await handleLoadPendingByOrderId(response.orderUploadId);
                await handleLoadPendingByEmail(Auth.getConnectedUser('email'));
            }

            setNotification({ show: true, message: t('equipment.upload.success') });
            setIsUploaded(true);
        } catch (error) {
            console.error('Error al procesar carga:', error);
            setNotification({ show: true, message: t('equipment.upload.error', fileName) });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBoxSnChange = (e) => setBoxSn(e.target.value);

    const resetPageState = async () => {
        setFileName(null);
        setSelectedModelId('');
        setBoxSn('');
        setSearchOrderId('');
        setSearchResults([]);
        setIsUploaded(false);
        setOrderUploadId('');
        setPendingMessage('');
        setPendingResults([]);
        setPendingPage(0);
        setEmailSearch(Auth.getConnectedUser('email') || '');
        try {
            const res = await TecrepEquipmentModelService.getModels({ category: 'ANCILLARY' });
            if (res.content) {
                setModels(res.content.filter(m => m.category === 'ANCILLARY'));
            }
        } catch (err) {
            console.error('Error al cargar modelos', err);
        }
        await handleLoadPendingByEmail(Auth.getConnectedUser('email'));
    };

    const handleSendEquipmets = async () => {
        const ids = searchResults.filter(r => r.found && r.data?.id).map(r => r.data.id);
        if (ids.length === 0) {
            setNotification({ show: true, message: 'No hay equipos validados para enviar' });
            return;
        }
        setIsSendingEquipments(true);
        try {
            const response = await TecrepEquipmentUploadService.sendValidEquipments(ids);
            if (response && response.status === 202) {
                const jobId = response.data?.jobId;
                setNotification({ show: true, message: `Procesamiento exitoso. Job ID: ${jobId}` });
                await resetPageState();
            }
        } catch (error) {
            console.error('Error al enviar equipments:', error);
            setNotification({ show: true, message: 'Error al enviar equipments' });
        } finally {
            setIsSendingEquipments(false);
            await loadJobs(Auth.getConnectedUser('email'));
        }
    };

    const handleUnscan = async (sn) => {
        try {
            await TecrepEquipmentUploadService.unscan(sn);
            setSearchResults(prev => prev.filter(r => r.boxSn !== sn));
            setNotification({ show: true, message: `Serial ${sn} eliminado` });
        } catch (error) {
            console.error('Error al desvalidar equipo:', error);
            setNotification({ show: true, message: getErrorMessage(error) });
        }
    };

    const handleSearch = async () => {
        if (!boxSn) {
            setNotification({ show: true, message: 'Debe introducir primero el Serial Number' });
            return;
        }
        if (searchResults.some(res => res.boxSn === boxSn)) {
            setNotification({ show: true, message: `El Serial Number ${boxSn} ya fue buscado` });
            return;
        }
        setIsSearching(true);
        try {
            const data = await TecrepEquipmentUploadService.getTempEquipment(boxSn);
            setSearchResults(prev => {
                const foundResults = prev.filter(r => r.found);
                const notFoundResults = prev.filter(r => !r.found);
                const newResult = { boxSn, found: true, data };
                return [newResult, ...foundResults, ...notFoundResults];
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setSearchResults(prev => {
                    const foundResults = prev.filter(r => r.found);
                    const notFoundResults = prev.filter(r => !r.found);
                    const newResult = { boxSn, found: false };
                    return [...foundResults, newResult, ...notFoundResults];
                });
            } else {
                console.error('Error al buscar serial number:', error);
            }
        } finally {
            setIsSearching(false);
            setBoxSn('');
        }
    };

    const handleLoadPendingByOrderId = async (id = orderUploadId) => {

        try {

            if (!id) {
                setNotification({ show: true, message: 'Debe ingresar un Order ID' });
                return;
            }
            setIsLoadingOrderId(true);
            const data = await TecrepEquipmentUploadService.getPendingByOrderId(id);
            setPendingResults(data);
            setOrderUploadId(id);
            setNotification({ show: true, message: t('equipment.pending.loadByOrderId.success') });
        } catch (error) {

            if (error.response && error.response.status === 404) {
                setNotification({ show: true, message: 'No se encontraron resultados' });
            } else {
                console.error('Error al cargar pendientes por orderUploadId:', error);
                setNotification({ show: true, message: t('equipment.pending.error') });
            }

        } finally {
            setIsLoadingOrderId(false);
        }

    };

    const handleLoadPendingByEmail = async (emailParam, isManual = false) => {

        try {

            const email = emailParam || emailSearch;
            if (!email) return;
            setIsLoadingEmail(true);
            const data = await TecrepEquipmentUploadService.getPendingByEmail(email);
            setPendingResults(data);
            setPendingMessage('');
            if (isManual) {
                setNotification({ show: true, message: t('equipment.pending.loadByEmail.success') });
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                setPendingResults([]);
                setPendingMessage('No tienes ordenes de carga pendientes');
                //setNotification({ show: true, message: t('equipment.pending.loadByEmail.notfound') });
                if (isManual) {
                    setNotification({ show: true, message: t('equipment.pending.loadByEmail.notfound') });
                }
            } else {
                console.error('Error al cargar pendientes por email:', error);
                setNotification({ show: true, message: t('equipment.pending.error') });
            }
        } finally {
            setIsLoadingEmail(false);
        }

    };

    const loadJobs = async (emailParam, isManual = false) => {

        try {

            const email = emailParam || emailSearch;
            if (!email) return;
            const data = await TecrepEquipmentUploadService.getCompletedByEmail(email);
            const uniqueJobIds = [...new Set(data.map(item => item.jobId))];
            if (uniqueJobIds.length === 0) {
                setJobResults([]);
                setJobMessage(t('equipment.jobs.noJobs'));

                // Mostrar notificación solo si la búsqueda fue manual
                if (isManual) {
                    setNotification({ show: true, message: 'No tienes ejecuciones de jobs disponibles' });
                }

                return;
            }
            const statuses = await Promise.all(uniqueJobIds.map(id =>
                TecrepEquipmentUploadService.getJobStatus(id).catch(err => {
                    console.error('Error al cargar estado de job', err);
                    return null;
                })
            ));
            const validStatuses = statuses.filter(Boolean);
            if (validStatuses.length > 0) {
                validStatuses.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
                setJobResults(validStatuses);
                setJobMessage('');
                if (isManual) {
                    setNotification({ show: true, message: 'Jobs cargados correctamente' });
                }
            } else {
                setJobResults([]);
                setJobMessage(t('equipment.jobs.noJobs'));

                if (isManual) {
                    setNotification({ show: true, message: 'No tienes ejecuciones de jobs disponibles' });
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setJobResults([]);
                setJobMessage(t('equipment.jobs.noJobs'));

                if (isManual) {
                    setNotification({ show: true, message: 'No tienes ejecuciones de jobs disponibles' });
                }

            } else {
                console.error('Error al cargar jobs completados:', error);
            }
        }
    };

    const handleLoadJobById = async () => {

        try {

            setIsLoadingJobId(true);
            if (!jobSearchId) {
                await loadJobs(Auth.getConnectedUser('email'), true);
                return;
            }

            const status = await TecrepEquipmentUploadService.getJobStatus(jobSearchId);
            setJobResults([status]);
            setJobMessage('');
            setNotification({ show: true, message: 'Job cargado correctamente' });
        } catch (error) {
            if (error.response && error.response.status === 500) {
                setJobResults([]);
                setJobMessage(t('equipment.jobs.noJobs'));
                setNotification({ show: true, message: 'No se encontro job con ese ID' });
            } else {
                console.error('Error al buscar job por id:', error);
            }
        } finally {
            setIsLoadingJobId(false);
        }
    };

    useEffect(() => {
        TecrepEquipmentModelService.getModels({ category: 'ANCILLARY' })
            .then((res) => {
                if (res.content) {
                    setModels(res.content.filter(m => m.category === 'ANCILLARY'));
                }
            })
            .catch((err) => {
                console.error('Error al cargar modelos', err);
            });
    }, []);

    useEffect(() => {
        handleLoadPendingByEmail();
    }, []);

    useEffect(() => {
        loadJobs(Auth.getConnectedUser('email'));
    }, []);

    useEffect(() => {
        setPendingPage(0);
    }, [pendingResults]);

    useEffect(() => {
        setJobPage(0);
    }, [jobResults]);

    useEffect(() => {
        setValidationPage(0);
    }, [searchResults]);

    const totalPendingPages = Math.ceil(pendingResults.length / pendingPageSize) || 1;
    const displayedPendingResults = pendingResults.slice(
        pendingPage * pendingPageSize,
        (pendingPage + 1) * pendingPageSize
    );

    const totalValidationPages = Math.ceil(searchResults.length / validationPageSize) || 1;
    const displayedValidationResults = searchResults.slice(
        validationPage * validationPageSize,
        (validationPage + 1) * validationPageSize
    );

    const totalJobPages = Math.ceil(jobResults.length / jobPageSize) || 1;
    const displayedJobResults = jobResults.slice(
        jobPage * jobPageSize,
        (jobPage + 1) * jobPageSize
    );

    return (

        <>

            <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>

                <h2>Carga de Equipos Nuevos</h2>

                <label style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1rem' }}>
                    Seleccionar archivo (.csv):
                </label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ marginBottom: '1rem' }}
                />

                {/* {fileName && (
                    <p style={{ color: 'green' }}>
                        Archivo cargado: <strong>{fileName}</strong>
                    </p>
                )} */}

                <label style={{ display: 'block', marginTop: '1rem' }}>
                    Seleccionar modelo:
                </label>
                <select
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                    style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%' }}
                >
                    <option value="">-- Seleccione un modelo --</option>
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name}
                        </option>
                    ))}
                </select>

                {fileName && selectedModelId && (
                    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                        <p><strong>Archivo cargado:</strong> {fileName}</p>
                        <p>
                            <strong>Modelo seleccionado:</strong>{' '}
                            {models.find((m) => m.id === parseInt(selectedModelId))?.name || 'N/A'}
                        </p>
                    </div>
                )}

                {/* <button
                    onClick={() => handleProcess()}
                    disabled={!fileName || !selectedModelId}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: fileName && selectedModelId ? 'pointer' : 'not-allowed'
                    }}
                >
                    Procesar archivo
                </button> */}

                <div style={{ marginTop: '1rem' }}>
                    <button
                        onClick={() => handleProcess()}
                        disabled={!fileName || !selectedModelId || isProcessing || isUploaded}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: fileName && selectedModelId && !isProcessing && !isUploaded ? 'pointer' : 'not-allowed'
                        }}
                    >
                        <CloudUploadIcon fontSize="small" style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        Procesar archivo
                    </button>
                    {isProcessing && <CircularProgress size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
                </div>

                {orderUploadId && (
                    <p style={{ marginTop: '1rem' }}><strong>{t('equipment.pending.orderUploadId')}:</strong> {orderUploadId}</p>
                )}

            </div>

            <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>

                <h2>Ordenes de carga pendientes</h2>

                <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                        placeholder="Order upload ID"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLoadPendingByOrderId(searchOrderId);
                            }
                        }}
                        style={{
                            marginRight: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />

                    <button
                        onClick={() => handleLoadPendingByOrderId(searchOrderId)}
                        disabled={isLoadingOrderId}
                        style={searchButtonStyle}
                    >
                        <SearchIcon fontSize="small" style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        {t('equipment.pending.loadByOrderId')}
                    </button>

                    {isLoadingOrderId && <CircularProgress size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
                    <button
                        onClick={() => handleLoadPendingByEmail(null, true)}
                        disabled={isLoadingEmail}
                        style={{ ...searchButtonStyle, marginLeft: '0.5rem' }}
                    >
                        <RefreshIcon fontSize="small" style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        {t('equipment.pending.loadByEmail')}
                    </button>
                    {isLoadingEmail && <CircularProgress size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}

                </div>

                {pendingMessage && (
                    <p>{pendingMessage}</p>
                )}

                {pendingResults && pendingResults.length > 0 && (
                    <>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    {['ID', 'poNo', 'partNo', 'boxSn', 'podSn', 'UploadId', 'creationDate'].map((key) => (
                                        <th key={key} style={thStyle}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayedPendingResults.map((item, idx) => (
                                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fafafa' : '#fff' }}>
                                        {['id', 'poNo', 'partNo', 'boxSn', 'podSn', 'orderUploadId', 'createdAt'].map((key) => (
                                            <td key={key} style={tdStyle}>
                                                {key === 'createdAt' ? getDisplayedDate(item[key]) : item[key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={() => setPendingPage(pendingPage - 1)}
                                disabled={pendingPage === 0}
                                style={{
                                    ...paginationButtonStyle,
                                    opacity: pendingPage === 0 ? 0.5 : 1,
                                    cursor: pendingPage === 0 ? 'not-allowed' : 'pointer'
                                }}
                            ><NavigateBeforeIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Anterior</button>
                            <span>Pagina {pendingPage + 1} de {totalPendingPages} - Total: {pendingResults.length}</span>
                            <button
                                onClick={() => setPendingPage(pendingPage + 1)}
                                disabled={pendingPage + 1 >= totalPendingPages}
                                style={{
                                    ...paginationButtonStyle,
                                    opacity: pendingPage + 1 >= totalPendingPages ? 0.5 : 1,
                                    cursor: pendingPage + 1 >= totalPendingPages ? 'not-allowed' : 'pointer'
                                }}
                            >Siguiente<NavigateNextIcon fontSize="small" style={{ verticalAlign: 'middle', marginLeft: '0.3rem' }} /></button>
                        </div>
                    </>
                )}
            </div>

            {(isUploaded || pendingResults.length > 0) && (

                <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>

                    <h2 style={{ marginBottom: '1rem' }}>Validación de equipos</h2>

                    <label style={{ marginRight: '0.5rem' }}>Serial Number:</label>
                    <input
                        type="text"
                        value={boxSn}
                        onChange={handleBoxSnChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        style={{
                            marginRight: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isSearching ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <SearchIcon fontSize="small" style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        Buscar
                    </button>

                    {isSearching && <CircularProgress size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}

                    {searchResults.length > 0 && (
                        <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Serial Number</th>
                                    <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Resultado</th>
                                    <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedValidationResults.map((res, index) => (
                                    <tr key={index} style={{ backgroundColor: res.found ? '#d4edda' : '#f8d7da' }}>
                                        <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{res.boxSn}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                                            {res.found ? `Encontrado ID: ${res.data.id}` : 'No encontrado'}
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'center' }}>
                                            {res.found && (
                                                <DeleteIcon
                                                    fontSize="small"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleUnscan(res.boxSn)}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {searchResults.length > 0 && (
                        <>
                            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    onClick={() => setValidationPage(validationPage - 1)}
                                    disabled={validationPage === 0}
                                    style={{
                                        ...paginationButtonStyle,
                                        opacity: validationPage === 0 ? 0.5 : 1,
                                        cursor: validationPage === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                ><NavigateBeforeIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Anterior</button>
                                <span>Pagina {validationPage + 1} de {totalValidationPages} - Total validados: {searchResults.filter(r => r.found).length}</span>
                                <button
                                    onClick={() => setValidationPage(validationPage + 1)}
                                    disabled={validationPage + 1 >= totalValidationPages}
                                    style={{
                                        ...paginationButtonStyle,
                                        opacity: validationPage + 1 >= totalValidationPages ? 0.5 : 1,
                                        cursor: validationPage + 1 >= totalValidationPages ? 'not-allowed' : 'pointer'
                                    }}
                                >Siguiente<NavigateNextIcon fontSize="small" style={{ verticalAlign: 'middle', marginLeft: '0.3rem' }} /></button>
                            </div>
                            <button
                                onClick={handleSendEquipmets}
                                disabled={isSendingEquipments}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: isSendingEquipments ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <SendIcon fontSize="small" style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                                Procesar
                            </button>
                            {isSendingEquipments && <CircularProgress size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
                        </>
                    )}
                </div>
            )}

            <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>

                <h2 style={{ marginBottom: '1rem' }}>Ejecución de jobs</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={jobSearchId}
                        onChange={(e) => setJobSearchId(e.target.value)}
                        placeholder="Job ID"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLoadJobById(searchOrderId);
                            }
                        }}
                        style={{
                            marginRight: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                    <button
                        onClick={handleLoadJobById}
                        disabled={isLoadingJobId}
                        style={searchButtonStyle}
                    >
                        <SearchIcon fontSize="small" style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        {t('equipment.jobs.loadByJobId')}
                    </button>
                    {isLoadingJobId && <CircularProgress size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
                </div>

                {jobResults.length === 0 ? (
                    <p>{jobMessage || t('equipment.jobs.noJobs')}</p>
                ) : (
                    <>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    {['jobId', 'totalLines', 'errorCount', 'startedAt', 'status', 'finishedAt'].map(key => (
                                        <th key={key} style={thStyle}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayedJobResults.map((item, idx) => {
                                    const getColor = (status) => {
                                        if (status === 'SUCCESS') return '#d4edda';
                                        if (status === 'FAILED') return '#f8d7da';
                                        return '#fff3cd';
                                    };
                                    return (
                                        <tr key={idx} style={{ backgroundColor: getColor(item.status) }}>
                                            {['jobId', 'totalLines', 'errorCount', 'startedAt', 'status', 'finishedAt'].map(key => (
                                                <td key={key} style={tdStyle}>
                                                    {key === 'status' ? (
                                                        <>
                                                            {item[key]}
                                                            {(item.status === 'FAILED' || item.status === 'SUCCESS_WITH_ERRORS') && item.errorDetails?.length > 0 && (
                                                                <VisibilityIcon
                                                                    fontSize="small"
                                                                    style={{ cursor: 'pointer', marginLeft: '0.3rem', verticalAlign: 'middle' }}
                                                                    onClick={() => { setSelectedErrorDetails(item.errorDetails); setErrorModalOpen(true); }}
                                                                />
                                                            )}
                                                        </>
                                                    ) : key.includes('At') ? getDisplayedDateTime(item[key]) : item[key]}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={() => setJobPage(jobPage - 1)}
                                disabled={jobPage === 0}
                                style={{
                                    ...paginationButtonStyle,
                                    opacity: jobPage === 0 ? 0.5 : 1,
                                    cursor: jobPage === 0 ? 'not-allowed' : 'pointer'
                                }}><NavigateBeforeIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Anterior</button>
                            <span>Pagina {jobPage + 1} de {totalJobPages} - Total: {jobResults.length}</span>
                            <button
                                onClick={() => setJobPage(jobPage + 1)}
                                disabled={jobPage + 1 >= totalJobPages}
                                style={{
                                    ...paginationButtonStyle,
                                    opacity: jobPage + 1 >= totalJobPages ? 0.5 : 1,
                                    cursor: jobPage + 1 >= totalJobPages ? 'not-allowed' : 'pointer'
                                }}>Siguiente<NavigateNextIcon fontSize="small" style={{ verticalAlign: 'middle', marginLeft: '0.3rem' }} /></button>
                        </div>
                    </>
                )}
            </div>

            <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Detalles de error</DialogTitle>
                <DialogContent>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                {['id', 'jobId', 'lineNumber', 'errorMessage', 'originalLine'].map(key => (
                                    <th key={key} style={thStyle}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedErrorDetails.map((err, idx) => (
                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fafafa' : '#fff' }}>
                                    <td style={tdStyle}>{err.id}</td>
                                    <td style={tdStyle}>{err.jobId}</td>
                                    <td style={tdStyle}>{err.lineNumber}</td>
                                    <td style={tdStyle}>{err.errorMessage}</td>
                                    <td style={tdStyle}>{err.originalLine}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorModalOpen(false)}>{t('button.close')}</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.show}
                message={notification.message}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, show: false })}
            />

        </>

    );
}