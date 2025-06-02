export const JobResourcesFields = [
    { id: 'id', label: 'id', hidden: true, infoPage: true },
    {
        id: 'operation',
        label: 'jobConfiguration.operation',
        type: 'enum',
        values: [
            { id: 'operationAll', key: '', value: 'all' },
            { id: 'numberRelease', key: 'NUMBER_RELEASE', value: 'job.numberRelease' },
            { id: 'numberPurge', key: 'NUMBER_PURGE', value: 'job.numberPurge' },
            { id: 'numberUnbook', key: 'NUMBER_UNBOOK', value: 'job.numberUnbook' },
            { id: 'rangePurge', key: 'RANGE_PURGE', value: 'job.rangePurge' },
            {id: 'rangeUnbook', key: 'RANGE_UNBOOK', value: 'job.rangeUnbook'},
            { id: 'ipAddressRelease', key: 'IPADDRESS_RELEASE', value: 'job.ipAddressRelease' },
            { id: 'ipAddressUnbook', key: 'IPADDRESS_UNBOOK', value: 'job.ipAddressUnbook' }
        ],
        filterable: true,
        addable: true,
        editable: true,
        infoPage: true
    },
    { id: 'activity', label: 'jobConfiguration.activity', type: 'enum', filterable: true, addable: true, editable: true, infoPage: true },
    { id: 'inventoryPool', label: 'jobConfiguration.inventoryPool', hidden: true, addable: true, editable: true, infoPage: true },
    { id: 'offerType', label: 'jobConfiguration.offerType', filterable: true, addable: true, editable: true, infoPage: true },
    { id: 'days', label: 'jobConfiguration.days', addable: true, editable: true, infoPage: true },
    {
        id: 'enabled',
        label: 'jobConfiguration.enabled',
        type: 'enum',
        values: [
            { id: 'all', key: '', value: 'all' },
            { id: 'yes', key: 'true', value: 'yes' },
            { id: 'no', key: 'false', value: 'no' }
        ],
        filterable: true,
        addable: true,
        editable: true,
        infoPage: true
    }
];
