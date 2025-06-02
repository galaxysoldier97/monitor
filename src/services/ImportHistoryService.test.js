import axios from 'axios';
import ImportHistoryService from './ImportHistoryService';
import { importHistoryMock } from '../../mocks/import.mock';

jest.mock('axios');

describe('import history service', () => {
  it('Error when loading import history', () => {
    axios.get.mockImplementationOnce(() => Promise.reject());
    const response = ImportHistoryService.search({filter: {}, pagination: {number: 2, size: 10}}, 'equipments');
    expect(response).rejects.toBeFalsy();
  });

  it('Successfully loaded import history', () => {
    const responseData = {
      data: {
        '_embedded': {
          'histories': importHistoryMock,
        },
      }
    };
    axios.get.mockImplementationOnce(() => Promise.resolve(responseData));
    const response = ImportHistoryService.search({filter: {}, pagination: {number: 2, size: 10}}, 'equipments');
    expect(response).resolves.toEqual(responseData.data);
  });

  it('Error when getLast import history', () => {
    axios.get.mockImplementationOnce(() => Promise.reject());
    const response = ImportHistoryService.getLast( 'equipments');
    expect(response).rejects.toBeFalsy();
  });

  it('Successfully getLast import history', () => {
    const responseData = {
      data: {
        "_embedded": {
          "histories": importHistoryMock[1]
        }
      }
    };
    axios.get.mockImplementationOnce(() => Promise.resolve(responseData));
    const response = ImportHistoryService.getLast( 'equipments');
    expect(response).resolves.toEqual(responseData.data);
  });

  it('Error when getById import history', () => {
    axios.get.mockImplementationOnce(() => Promise.reject());
    const response = ImportHistoryService.getById( 117, 'equipments');
    expect(response).rejects.toBeFalsy();
  });

  it('Successfully getById import history', () => {
    const responseData = {
      data: {
        "_embedded": {
          "histories": importHistoryMock[0]
        }
      }
    };
    axios.get.mockImplementationOnce(() => Promise.resolve(responseData));
    const response = ImportHistoryService.getById( 117, 'equipments');
    expect(response).resolves.toEqual(responseData.data);
  });

  it('Error when delete import history', () => {
    axios.delete.mockImplementationOnce(() => Promise.reject());
    const response = ImportHistoryService.deleteLast( 'equipments');
    expect(response).rejects.toBeFalsy();
  });

  it('Successfully delete import history', () => {
    const responseData = {
      data: {}
    };
    axios.delete.mockImplementationOnce(() => Promise.resolve(responseData));
    const response = ImportHistoryService.deleteLast( 'equipments');
    expect(response).resolves.toEqual({});
  });
});

