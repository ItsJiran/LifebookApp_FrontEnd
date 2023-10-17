
let test =  [
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    15,
    16,
    16,
    16,
    16,
    16,
    16
];

const FormatDate = (raw_date) => {
    // expected raw_date : yyyy-mm-dd
    var split = raw_date.split('-');
    return {
        year:split[0],
        month:split[1],
        day:split[2],
    }
}

let tmp = [
    {
        "id": 2,
        "user_id": 1,
        "title": "testase",
        "date": "2023-10-15",
        "time": "22:22:00"
    },
    {
        "id": 3,
        "user_id": 1,
        "title": "Testing",
        "date": "2023-10-16",
        "time": "19:56:00"
    },
    {
        "id": 4,
        "user_id": 1,
        "title": "Testing",
        "date": "2023-10-15",
        "time": "19:56:00"
    },
    {
        "id": 5,
        "user_id": 1,
        "title": "Jurnal 2",
        "date": "2023-10-16",
        "time": "11:20:00"
    },
    {
        "id": 6,
        "user_id": 1,
        "title": "Cukup Kini Kau Sadari",
        "date": "2023-10-16",
        "time": "11:52:00"
    },
    {
        "id": 7,
        "user_id": 1,
        "title": "Judul Baru",
        "date": "2023-10-16",
        "time": "12:09:00"
    },
    {
        "id": 10,
        "user_id": 1,
        "title": "test213",
        "date": "2023-10-16",
        "time": "12:23:00"
    },
    {
        "id": 11,
        "user_id": 1,
        "title": "tset23",
        "date": "2023-10-16",
        "time": "12:24:00"
    },
    {
        "id": 12,
        "user_id": 1,
        "title": "test232",
        "date": "2023-10-16",
        "time": "12:25:00"
    },
    {
        "id": 13,
        "user_id": 1,
        "title": "test223",
        "date": "2023-10-16",
        "time": "12:31:00"
    },
    {
        "id": 14,
        "user_id": 1,
        "title": "Test Tanggal 2",
        "date": "2023-10-16",
        "time": "12:40:00"
    },
    {
        "id": 15,
        "user_id": 1,
        "title": "test213",
        "date": "2023-10-16",
        "time": "12:41:00"
    },
    {
        "id": 16,
        "user_id": 1,
        "title": "test231",
        "date": "2023-10-16",
        "time": "12:42:00"
    },
    {
        "id": 17,
        "user_id": 1,
        "title": "test213",
        "date": "2023-10-16",
        "time": "12:44:00"
    },
    {
        "id": 18,
        "user_id": 1,
        "title": "test231",
        "date": "2023-10-16",
        "time": "12:45:00"
    },
    {
        "id": 20,
        "user_id": 1,
        "title": "teatetase",
        "date": "2023-10-15",
        "time": "12:45:00"
    },
    {
        "id": 19,
        "user_id": 1,
        "title": "123123123",
        "date": "2023-10-16",
        "time": "12:45:00"
    },
    {
        "id": 21,
        "user_id": 1,
        "title": "test231",
        "date": "2023-10-16",
        "time": "12:49:00"
    },
    {
        "id": 22,
        "user_id": 1,
        "title": "ttttttttt",
        "date": "2023-10-16",
        "time": "12:55:00"
    },
    {
        "id": 23,
        "user_id": 1,
        "title": "test22",
        "date": "2023-10-16",
        "time": "13:01:00"
    },
    {
        "id": 24,
        "user_id": 1,
        "title": "test23132",
        "date": "2023-10-16",
        "time": "13:05:00"
    },
    {
        "id": 25,
        "user_id": 1,
        "title": "test231",
        "date": "2023-10-16",
        "time": "13:09:00"
    }
]

let new_tmp = {
    "2023": {
        "10": {
            "15": [
                {
                    "id": 2,
                    "user_id": 1,
                    "title": "testase",
                    "date": "2023-10-15",
                    "time": "22:22:00"
                },
                {
                    "id": 3,
                    "user_id": 1,
                    "title": "Testing",
                    "date": "2023-10-15",
                    "time": "19:56:00"
                },
                {
                    "id": 4,
                    "user_id": 1,
                    "title": "Testing",
                    "date": "2023-10-15",
                    "time": "19:56:00"
                },
                {
                    "id": 20,
                    "user_id": 1,
                    "title": "teatetase",
                    "date": "2023-10-15",
                    "time": "12:45:00"
                }
            ],
            "16": [
                {
                    "id": 5,
                    "user_id": 1,
                    "title": "Jurnal 2",
                    "date": "2023-10-16",
                    "time": "11:20:00"
                },
                {
                    "id": 6,
                    "user_id": 1,
                    "title": "Cukup Kini Kau Sadari",
                    "date": "2023-10-16",
                    "time": "11:52:00"
                },
                {
                    "id": 7,
                    "user_id": 1,
                    "title": "Judul Baru",
                    "date": "2023-10-16",
                    "time": "12:09:00"
                },
                {
                    "id": 10,
                    "user_id": 1,
                    "title": "test213",
                    "date": "2023-10-16",
                    "time": "12:23:00"
                },
                {
                    "id": 11,
                    "user_id": 1,
                    "title": "tset23",
                    "date": "2023-10-16",
                    "time": "12:24:00"
                },
                {
                    "id": 12,
                    "user_id": 1,
                    "title": "test232",
                    "date": "2023-10-16",
                    "time": "12:25:00"
                },
                {
                    "id": 13,
                    "user_id": 1,
                    "title": "test223",
                    "date": "2023-10-16",
                    "time": "12:31:00"
                },
                {
                    "id": 14,
                    "user_id": 1,
                    "title": "Test Tanggal 2",
                    "date": "2023-10-16",
                    "time": "12:40:00"
                },
                {
                    "id": 15,
                    "user_id": 1,
                    "title": "test213",
                    "date": "2023-10-16",
                    "time": "12:41:00"
                },
                {
                    "id": 16,
                    "user_id": 1,
                    "title": "test231",
                    "date": "2023-10-16",
                    "time": "12:42:00"
                },
                {
                    "id": 17,
                    "user_id": 1,
                    "title": "test213",
                    "date": "2023-10-16",
                    "time": "12:44:00"
                },
                {
                    "id": 18,
                    "user_id": 1,
                    "title": "test231",
                    "date": "2023-10-16",
                    "time": "12:45:00"
                },
                {
                    "id": 19,
                    "user_id": 1,
                    "title": "123123123",
                    "date": "2023-10-16",
                    "time": "12:45:00"
                },
                {
                    "id": 21,
                    "user_id": 1,
                    "title": "test231",
                    "date": "2023-10-16",
                    "time": "12:49:00"
                },
                {
                    "id": 22,
                    "user_id": 1,
                    "title": "ttttttttt",
                    "date": "2023-10-16",
                    "time": "12:55:00"
                },
                {
                    "id": 23,
                    "user_id": 1,
                    "title": "test22",
                    "date": "2023-10-16",
                    "time": "13:01:00"
                },
                {
                    "id": 24,
                    "user_id": 1,
                    "title": "test23132",
                    "date": "2023-10-16",
                    "time": "13:05:00"
                },
                {
                    "id": 25,
                    "user_id": 1,
                    "title": "test231",
                    "date": "2023-10-16",
                    "time": "13:09:00"
                }
            ]
        },
        "09": {
            "16": [
                {
                    "id": 8,
                    "user_id": 1,
                    "title": "Test Beda Tahun",
                    "date": "2023-09-16",
                    "time": "12:21:00"
                }
            ],
            "03": [
                {
                    "id": 1,
                    "user_id": 1,
                    "title": "YunaTaira",
                    "date": "2023-09-03",
                    "time": "10:58:00"
                }
            ]
        }
    },
    "2025": {
        "10": {
            "16": [
                {
                    "id": 9,
                    "user_id": 1,
                    "title": "Test213",
                    "date": "2025-10-16",
                    "time": "12:22:00"
                }
            ]
        },
        "01": {
            "03": [
                {
                    "id": 26,
                    "user_id": 1,
                    "title": "kamuuuuuu",
                    "date": "2025-01-03",
                    "time": "13:14:00"
                }
            ]
        }
    }
}

for(let i = 0; i < tmp.length; i++){

    if(tmp[i+1] !== undefined){
      if( parseInt( FormatDate(tmp[i].date).day ) > parseInt( FormatDate(tmp[i+1].date).day ) ){
        var n = tmp[i];
        tmp[i] = tmp[i+1];
        tmp[i+1] = n;
        console.log('switched next');
      }
    }

    if(tmp[i-1] !== undefined){
      if( parseInt( FormatDate(tmp[i].date).day ) < parseInt( FormatDate(tmp[i-1].date).day ) ){
        var n = tmp[i];
        tmp[i] = tmp[i-1];
        tmp[i-1] = n;
        i=0;   
        console.log('switched prev');
      }

    }

    console.log('---------------')

  }

console.log(tmp);

// dry run
// it-0 = [4,5,3,2,1];
// it-1 = [3,4,5,2,1];
// it-0 = [3,4,5,2,1];
// it-1 = [3,4,5,2,1];
// it-2 = []

// let step = 0;
// for(let i = 0; i < test.length; i++){
  
//     if(test[i+1] !== undefined){
//         if(test[i]<test[i+1]) {
//             var tmp = test[i];
//             test[i] = test[i+1];
//             test[i+1] = tmp;
//         }
//     }

//     console.log(i,test);

//     if(test[i-1] !== undefined){
//         if(test[i]>test[i-1]) {
//             var tmp = test[i];
//             test[i] = test[i-1];
//             test[i-1] = tmp;
//             i=0;   
//         }
//     }

//     console.log(i,test,'end');

// }
