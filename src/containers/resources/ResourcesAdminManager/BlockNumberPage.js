import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import { ResourceAdminCategories } from "../../../config/resources/ResourceImportableProperties";
import {BlockFields} from "../../../config/resources/BlockFields";
import {ROUTES} from "../../../config/routes";

export default function BlockNumberPage(){

    return <DefaultTable
        columnHeader={BlockFields}
        entity={ResourceAdminCategories.BLOCK}
        detailLink={ROUTES.blockNumberInfo.path}
        showDetailsButton
        showEditButton={false}
        showDeleteButton
    />;
}
