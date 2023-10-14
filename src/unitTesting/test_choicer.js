import React, { useState } from "react";
import { Icon } from "../components/Components";
import { Button } from "../components/ui/Buttons";
import { useChoicerController } from "../hooks_utils/ChoicerUtils";
import { useConfirmerController } from "../hooks_utils/NavigateUtils";
import { Iconsax } from "../utils";


export function test_choicer_component(){

    const ConfirmerController = useConfirmerController();
    const ChoicerController = useChoicerController();
    const [state,setState] = useState(undefined);

    const elmChoices = ( 
    <>
        <div onClick={ ()=>{ ChoicerController.action('View Routine') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-blue-dark-300 h-6 w-6 mr-3" iconUrl={Iconsax.bold['eye.svg']}/>
            <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4">View Routine</label>
        </div>

        <div onClick={ ()=>{ ChoicerController.action('Delete Log') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-red-400 h-6 w-6 mr-3" iconUrl={Iconsax.bold['trash.svg']}/>
            <label className="text-red-400 text-sm font-semibold tracking-wide leading-4">Delete Log</label>
        </div>
    </> )

    const showChoicer = async ()=>{
        const result = await ChoicerController.show(elmChoices);
        setState(result);

        let thread = undefined;
        if(result == 'View Routine') thread = await ConfirmerController.confirm();
        console.log(thread);
    }

    return ( 
        <>
            <h1>RESULT : {state}</h1>
            <Button onClick={showChoicer}>Test Choicer</Button>            
        </>
     )

}