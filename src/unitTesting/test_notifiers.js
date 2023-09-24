import React, {useContext} from "react";

import { Button } from "../components/ui/Buttons";

import { NotifierContext } from "../hooks/Notifier";
import { useNotifierController } from "../hooks_utils/NotifierUtils";
import { useConfirmerController } from "../hooks_utils/ConfirmerUtils";

export function test_notifier_components(){

    const [notifier,notifierDispatch] = useContext(NotifierContext);
    const ConfirmerController = useConfirmerController();
    const NotifierController = useNotifierController();

    return (
    <>
    
        <Button className="absolute top-0 left-32" onClick={()=>{NotifierController.addNotification({message:'test',title:'test',type:'SUCCESS'})}}>
            Notification 
        </Button>

        <Button className="absolute top-0" onClick={()=>{ConfirmerController.confirm({content:{message:'test',title:'test'}})}}>
            Mesage 
        </Button>

        <Button className="absolute top-10" onClick={()=>{NotifierController.toggleLoading(!notifier.loading)}}>
            ToggleLoading 
        </Button>

    </>
    )
}
