export const blockNumbersFields = [
  {
    id: 'blockId',
    hidden: true,
    infoPage: true,
  },
  {
    id: 'blockPrefix',
    label: 'block.blockPrefix',
    filterable: true,
    editable: true,
    infoPage: true,
  },
  {
    id: 'countryCode',
    label: 'block.countryCode',
    type: 'number',
    filterable: true,
    editable: true,
    infoPage: true,
  },
  {
    id: 'length',
    label: 'block.length',
    type: 'number',
    hidden: true,
    addable: true,
    infoPage: true,
  },
  {
    id: 'localPrefix',
    label: 'block.localPrefix',
    type: 'number',
    addable: true,
    infoPage: true,
  },
  {
    id: 'zone',
    label: 'block.zone',
    type: 'string',
    addable: true,
    infoPage: true,
  },
  {
    id: 'actions',
    label: '',
    cellProps: {
      style: {
        whiteSpace: 'nowrap',
      },
    },
  },
];
