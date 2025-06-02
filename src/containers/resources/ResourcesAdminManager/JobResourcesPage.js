import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import { ResourceAdminCategories } from "../../../config/resources/ResourceImportableProperties";
import {JobResourcesFields} from "../../../config/resources/JobResourcesFields";
import {useFetchRscActivities} from "../../../hooks/useFetchRscActivities";
export default function JobResourcesPage(){
    useFetchRscActivities();

    return <DefaultTable
        columnHeader={JobResourcesFields}
        entity={ResourceAdminCategories.JOB}
        showDetailsButton
        showEditButton
        showDeleteButton
    />;
}
