export const SimcardGenerationConfigFields = [
    {id: 'algorithmVersion', label: 'simcardGenerationConfiguration.algorithmVersion', addable: true, editable: true, type: 'number',  infoPage: true},
    {id: 'name', label: 'name', addable: true, editable: true,  infoPage: true},
    {id: 'msinSequence', label: 'simcardGenerationConfiguration.msinSequence', addable: true, editable: true,  infoPage: true},
    {id: 'iccidSequence', label: 'simcardGenerationConfiguration.iccidSequence', addable: true, editable: true,  infoPage: true},
    {id: 'plmnCode', label: 'simcardGenerationConfiguration.plmn', addable: true, editable: true,  infoPage: true},
    {id: 'exportFileConfigurationName', label: 'simcardGenerationConfiguration.exportFileConfiguration', addable: true, editable: true, infoPage: true},
    {id: 'importFileConfigurationName', label: 'simcardGenerationConfiguration.importFileConfiguration', addable: true, editable: true, infoPage: true},
    {id: 'notify', label: 'simcardGenerationConfiguration.notify', addable: false, editable: false, hidden: true, infoPage: true},
    {id: 'transportKey', label: 'simcardGenerationConfiguration.transportKey', addable: true, editable: true, type: 'number', infoPage: true},
    {id: 'artwork', label: 'simcardGenerationConfiguration.artwork', addable: true, editable: true, infoPage: true},
    {id: 'simReference', label: 'simcardGenerationConfiguration.simReference', addable: true, editable: true, infoPage: true},
    {id: 'type', label: 'simcardGenerationConfiguration.type', addable: true, editable: true, hidden: true},
    {id: 'fixedPrefix', label: 'simcardGenerationConfiguration.fixedPrefix', addable: true, editable: true, type: 'number', hidden: true, infoPage: true},
    {id: 'sequencePrefix', label: 'simcardGenerationConfiguration.sequencePrefix', addable: true, editable: true, type: 'number', hidden: true, infoPage: true}
];
