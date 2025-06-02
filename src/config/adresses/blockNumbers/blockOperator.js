import { t } from 'mt-react-library/functions';

export const BlockOperatorEnum = Object.freeze({
  SYSTEM: 'SYSTEM',
  ORANGE: 'ORANGE',
  CYTA: 'CYTA',
  EXTERNAL: 'EXTERNAL',
});

export const blockOperator = [
  {
    id: 'operatorAll',
    key: '',
    value: t('block.all'),
  },
  {
    id: 'system',
    key: BlockOperatorEnum.SYSTEM,
    value: t('block.system'),
  },
  {
    id: 'orange',
    key: BlockOperatorEnum.ORANGE,
    value: t('block.orange'),
  },
  {
    id: 'cyta',
    key: BlockOperatorEnum.CYTA,
    value: t('block.cyta'),
  },
  {
    id: 'external',
    key: BlockOperatorEnum.EXTERNAL,
    value: t('block.external'),
  },
];
