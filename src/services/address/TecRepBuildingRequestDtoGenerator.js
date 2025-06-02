class TecRepBuildingRequestDtoGenerator {

  static prepareForAddDeployStatus(deploymentStatus, data) {
    return {
      'buildingId': deploymentStatus.buildingId,
      'accessType': data.accessType,
      'verDeployStatus': data.verDeployStatus,
      'horDeployStatus': data.horDeployStatus,
      'expectedDeploy': deploymentStatus.expectedDeploy,
      'specificity': data.specificity,
    };
  }

  static prepareForUpdateDeployStatus(deploymentStatus) {
    return {
      'deploymentStatusId': deploymentStatus.buildingStatusId,
      'accessType': deploymentStatus.accessType,
      'verDeployStatus': deploymentStatus.verDeployStatus,
      'horDeployStatus': deploymentStatus.horDeployStatus,
      'expectedDeploy': deploymentStatus.expectedDeploy,
      'specificity': deploymentStatus.specificity,
    };
  }

  static prepareForAddFlatBuildingDto(buildingFlat, data) {
    return {
      'buildingId': buildingFlat.buildingId,
      'flatCode': data.flatCode,
      'blockNumber': data.blockNumber,
      'floorNumber': data.floorNumber,
      'flatNumber': data.flatNumber,
    };
  }

  static prepareForUpdateBuildingFlat(buildingFlat) {
    return {
      'buildingFlatId': buildingFlat.buildingFlatId,
      'buildingId': buildingFlat.buildingId,
      'flatCode': buildingFlat.flatCode,
      'blockNumber': buildingFlat.blockNumber,
      'floorNumber': buildingFlat.floorNumber,
      'flatNumber': buildingFlat.flatNumber,
    };
  }

  static prepareForUpdateBuilding(building) {
    return {
      'buildingCode': building.buildingCode,
      'buildingId': building.buildingId,
      'buildingName': building.buildingName,
      'longitude': building.longitude,
      'latitude': building.latitude,
      'remark': building.remark,
    };
  }

  static prepareForAddPostalAddress(data, postalAddress) {
    let mainFLagBool = true;
    if (data.mainFlag === 'no') {
      mainFLagBool = false;
    }
    return {
      'buildingId': postalAddress.buildingId,
      'buildingType': data.buildingType,
      'buildingBlock': data.buildingBlock,
      'flatNumber': data.flatNumber,
      'mainFlag': mainFLagBool,
    };
  }

  static prepareForUpdateBuildingFlatPto(data) {
    return {
      'ptoTechnicalId': data.ptoTechnicalId,
      'ptoNumber': data.ptoNumber,
      'relatedBlock': data.relatedBlock,
      'relatedFloor': data.relatedFloor,
      'ptoCategory': data.ptoCategory,
      'ptoDeployed': data.ptoDeployed,
      'remark': data.remark,
    };
  }

  static prepareForUpdateBuildingFlatPtoAccessPoint(data) {
    return {
      'accessPointNumber': data.accessPointNumber,
      'accessType': data.accessType,
    };
  }

}

export default TecRepBuildingRequestDtoGenerator;

