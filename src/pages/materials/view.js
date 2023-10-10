import React, { useState } from "react";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";
import { useParams } from "react-router-dom";
import { useApiService } from "../../hooks_utils/ApiUtils";
import { Icon, LoadingContainer } from "../../components/Components";
import { Iconsax } from "../../utils";

export default function MaterialsViewPage() {

    // ========================================================================================================
    // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
    // ========================================================================================================
    const { id } = useParams();

    // -- Service And Controller
    const AppService = useAppService();
    const ApiService = useApiService();

    // -- Variable And State
    const [pageState, setPageState] = useState({
        error:{
            status:false,
            data:undefined,
        },
    });
    const [resources, setResources] = useState([]);
    const [resourcesElm, setResourcesElm] = useState([]);

    // ========================================================================================================
    // ------------------------------------------- REACT EFFECT -----------------------------------------------
    // ========================================================================================================
    React.useEffect(() => {
        AppService.navbar.set.status( AppService.navbar.status().hidden );
    }, []);

    // ========================================================================================================
    // -------------------------------------------- FUNCTIONS -------------------------------------------------
    // ========================================================================================================


    return (
        <>
            <iframe className="h-full" src={'/standalone/materials/view/'+id}/>

            <div className="w-full absolute bottom-5">
                <LoadingContainer key='notifier-more' className="mx-auto h-fit w-fit shadow bg-blue-100"> 
                    { AppService.navbar.get.status() == AppService.navbar.status().show ? 
                        <Icon onClick={()=>{AppService.navbar.set.status( AppService.navbar.status().hidden )}} className="h-5 w-5 filter-blue-dark-400" iconUrl={Iconsax.bold['arrow-bottom.svg']}/>
                    : '' }
                    { AppService.navbar.get.status() == AppService.navbar.status().hidden ? 
                        <Icon onClick={()=>{AppService.navbar.set.status( AppService.navbar.status().show )}} className="h-5 w-5 filter-blue-dark-400" iconUrl={Iconsax.bold['arrow-up-2.svg']}/>
                    : '' }
                </LoadingContainer>
            </div>


        </>
    )

}