import axios from 'axios';
import { ProductCatalogService } from './ProductCatalogService';
import { productCatalogMock } from '../../mocks/productCatalog.mock';

jest.mock('axios');

describe('product catalog service', () => {
  it('Error when loading product catalog', () => {
    axios.get.mockImplementationOnce(() => Promise.reject());
    const response = ProductCatalogService.fetch();
    expect(response).rejects.toBeFalsy();
  });

  it('Successfully loaded product catalog', () => {
    const responseData = {
      data: productCatalogMock,
    };
    axios.get.mockImplementationOnce(() => Promise.resolve(responseData));
    const response = ProductCatalogService.fetch();
    expect(response).resolves.toEqual(responseData.data);
  });

});

