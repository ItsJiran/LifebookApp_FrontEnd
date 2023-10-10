
let test =  [5,4,3,2,1];

// dry run
// it-0 = [4,5,3,2,1];
// it-1 = [3,4,5,2,1];
// it-0 = [3,4,5,2,1];
// it-1 = [3,4,5,2,1];
// it-2 = []

let step = 0;
for(let i = 0; i < test.length; i++){
    step++;
    if(test[i+1] !== undefined){
        if(test[i]>test[i+1]) {
            var tmp = test[i];
            test[i] = test[i+1];
            test[i+1] = tmp;
        }
    }

    console.log(i,test);

    if(test[i-1] !== undefined){
        if(test[i]<test[i-1]) {
            var tmp = test[i];
            test[i] = test[i-1];
            test[i-1] = tmp;
            i=0;   
        }
    }

    console.log(i,test,'end');

}

console.log(test,step);