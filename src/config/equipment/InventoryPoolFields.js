export const InventoryPoolFields = [
    {id: 'inventoryPoolId', label: 'id'},
    {id: 'code', label: 'simcard.batches.inventoryPoolCode', editable: true, addable: true},
    {id: 'description', label: 'description', editable: true, addable: true},
    {id: 'mvno', label: 'inventoryPool.mvno', editable: true, addable: true},
    {id: 'simProfile', label: 'inventoryPool.simProfile', editable: true, addable: true, type: 'enum', values: [
            {
                id: 'DEFAULT',
                key: 'DEFAULT',
                value: 'inventoryPool.simProfileDefault',
            },
            {
                id: 'REPLACEMENT',
                key: 'REPLACEMENT',
                value: 'inventoryPool.simProfileReplacement',
            },
        ]}
];
