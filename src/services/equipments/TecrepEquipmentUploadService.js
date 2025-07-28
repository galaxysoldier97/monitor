import axios from 'axios';
import Auth from '../Auth';
import { Backend } from '../../data';

class TecrepEquipmentUploadService {

    /**
     * Sube archivo de carga masiva de equipos al endpoint temporal
     * @param {FormData} formData - Contiene el archivo y el modelo
     * @returns {Promise<Object>} - Respuesta del backend
     */
    static uploadTempEquipments(formData) {
        return axios.post(
            Backend.equipments.uploadTemp.url,
            formData,
            {
                ...Auth.authorize(),
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...Auth.authorize().headers,
                },
            }
        )
            .then(res => res.data)
            .catch(err => {
                console.error('Error al subir archivo temporal:', err);
                throw err;
            });
    }

    /**
     * Obtiene un equipmento temporal por serial number (boxSn)
     * @param {string} boxSn - Serial number del equipo
     * @returns {Promise<Object>} - Respuesta del backend
     */
    static getTempEquipment(boxSn) {
        return axios.get(`${Backend.equipments.equipmentstemp.url}/${boxSn}`, Auth.authorize())
            .then(res => res.data)
            .catch(err => {
                console.error('Error al buscar equipmento temporal:', err);
                throw err;
            });
    }

    /**
     * Obtiene los equipments pendientes por orderUploadId
     * @param {string|number} orderUploadId - Id retornado al cargar el archivo
     * @returns {Promise<Object>}
     */
    static getPendingByOrderId(orderUploadId) {
        return axios.get(`${Backend.equipments.pending.url}/${orderUploadId}`, Auth.authorize())
            .then(res => res.data)
            .catch(err => {
                console.error('Error al buscar equipments pendientes por orderUploadId:', err);
                throw err;
            });
    }

    /**
     * Obtiene los equipments pendientes asociados a un email
     * @param {string} email - Correo electrónico del usuario
     * @returns {Promise<Object>}
     */
    static getPendingByEmail(email) {
        return axios.get(`${Backend.equipments.pending.url}?email=${email}`, Auth.authorize())
            .then(res => res.data)
            .catch(err => {
                console.error('Error al buscar equipments pendientes por email:', err);
                throw err;
            });
    }

    /**
     * Obtiene los equipments completados asociados a un email
     * @param {string} email - Correo electrónico del usuario
     * @returns {Promise<Object>}
     */
    static getCompletedByEmail(email) {
        return axios.get(`${Backend.equipments.completed.url}?email=${email}`, Auth.authorize())
            .then(res => res.data)
            .catch(err => {
                console.error('Error al buscar equipments completados por email:', err);
                throw err;
            });
    }

    /**
     * Obtiene el estado de importación de equipos ancillary por jobId
     * @param {number|string} jobId - Identificador del job
     * @returns {Promise<Object>}
     */
    static getJobStatus(jobId) {
        return axios.get(`${Backend.equipments.jobStatus.url}/${jobId}`, Auth.authorize())
            .then(res => res.data)
            .catch(err => {
                console.error(`Error al buscar estado del job ${jobId}:`, err);
                throw err;
            });
    }

    /**
     * Envía los equipments validados
     * @param {Array<number>} equipmentIds - IDs de los equipments validados
     * @returns {Promise<AxiosResponse>} - Respuesta del backend
     */
    static sendValidEquipments(equipmentIds) {
        return axios.post(
            Backend.equipments.sendValidEquipments.url,
            equipmentIds,
            {
                ...Auth.authorize(),
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.authorize().headers,
                },
            }
        )
            .catch(err => {
                console.error('Error al enviar equipments:', err);
                throw err;
            });
    }

    /**
     * Resetea el escaneo de un equipmento temporal
     * @param {string} boxSn - Serial number del equipo
     * @returns {Promise<Object>} - EquipmentTemp actualizado
     */
    static unscan(boxSn) {
        return axios.patch(
            `${Backend.equipments.equipmentstemp.url}/${boxSn}/unscan`,
            {},
            Auth.authorize(),
        )
            .then(res => res.data)
            .catch(err => {
                console.error(`Error al desvalidar equipmento temporal ${boxSn}:`, err);
                throw err;
            });
    }
}

export default TecrepEquipmentUploadService;
