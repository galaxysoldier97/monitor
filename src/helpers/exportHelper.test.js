import { getCurrentDate } from './exportHelper';

describe('exportHelper', () => {
  test('getCurrentDate should display file name with current date', () => {
      const mockDate = new Date(1466424490000);
      jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate);
      expect(getCurrentDate()).toBe('2016-06-20-12:08:10');
    },
  );
});
