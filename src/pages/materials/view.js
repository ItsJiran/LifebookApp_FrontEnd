import React, { useState } from "react";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";
import { useParams } from "react-router-dom";
import { useApiService } from "../../hooks_utils/ApiUtils";
import { Container, Icon, LoadingContainer } from "../../components/Components";
import { Iconsax } from "../../utils";
import { AuthLoading } from "../../components/Route";

export default function MaterialsViewPage() {

    // ========================================================================================================
    // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
    // ========================================================================================================
    const { id } = useParams();

    // -- Service And Controller
    const AppService = useAppService();
    const ApiService = useApiService();

    // -- Variable And State
    const [action,setAction] = useState(true);

    // ========================================================================================================
    // ------------------------------------------- REACT EFFECT -----------------------------------------------
    // ========================================================================================================
    React.useEffect(() => {
        AppService.navbar.set.status( AppService.navbar.status().hidden );
        document.title = 'LifebookApp | View Material ' + id;
    }, []);

    // ========================================================================================================
    // -------------------------------------------- FUNCTIONS -------------------------------------------------
    // ========================================================================================================
    const handleClick = ()=>{
        if( AppService.navbar.get.status() == AppService.navbar.status().show ) AppService.navbar.set.status( AppService.navbar.status().hidden );
        else                                                                    AppService.navbar.set.status( AppService.navbar.status().show )
    }

    return (
        <div className="relative h-full w-full">

            {/* Iframe */}
            { action ? 
              <Container className="bg-white absolute h-full w-full top-0 left-0">
                  <AuthLoading/>
              </Container> 
            : '' }

            {/* Iframe */}
            <iframe onLoad={()=>{ setAction(false) }} className="h-full w-full" src={'/standalone/materials/view/'+id}/>

            {/* Arrow */}
            <div className="w-full absolute bottom-5">
                <LoadingContainer onClick={handleClick} key='notifier-more' className="mx-auto h-fit w-fit shadow bg-blue-100"> 
                    { AppService.navbar.get.status() == AppService.navbar.status().show ? 
                        <Icon className="h-5 w-5 filter-blue-dark-400" iconUrl={Iconsax.bold['arrow-bottom.svg']}/>
                    : '' }
                    { AppService.navbar.get.status() == AppService.navbar.status().hidden ? 
                        <Icon className="h-5 w-5 filter-blue-dark-400" iconUrl={Iconsax.bold['arrow-up-2.svg']}/>
                    : '' }
                </LoadingContainer>
            </div>


        </div>
    )

}