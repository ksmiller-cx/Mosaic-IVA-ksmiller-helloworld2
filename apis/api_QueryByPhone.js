function getRecord(street_num, street_name, account_num) {
    return {
        StreetNumber: street_num,
        StreetName: street_name,
        AccountNumber: account_num
    };
}

module.exports = function queryByPhone_api(logger, phone_num) {
    const routine = `app:queryByPhone_api`;
    logger.debug({ routine, message: `Start query by phone request`, phone_number: phone_num });

    let street_num_arr = { recordCount: 0, data: [] };
    let last_2_digits = Number(phone_num.toString().replace(/[^0-9]/g, '').slice(-2));

    // simulate query by phone records
    let record_1 = getRecord(1111, '1st', 111111111);
    let record_2 = getRecord(2222, '2nd', 222222222);
    let record_3 = getRecord(3333, '3rd', 333333333);


    switch (last_2_digits) {
        // no records
        case 10:
            break;

        // one record
        case 11:
            street_num_arr.recordCount = 1;
            street_num_arr.data.push(record_1);
            break;

        // 2 different records
        case 21:
            street_num_arr.recordCount = 2;
            street_num_arr.data.push(record_1);
            street_num_arr.data.push(record_2);
            break;

        // 2 records w/same street_num
        case 22:
            street_num_arr.recordCount = 2;
            street_num_arr.data.push(record_2);
            street_num_arr.data.push(record_2);
            break;

        // 3 different records
        case 31:
            street_num_arr.recordCount = 3;
            street_num_arr.data.push(record_1);
            street_num_arr.data.push(record_2);
            street_num_arr.data.push(record_3);
            break;

        // 3 records 2 w/same street_num
        case 32:
            street_num_arr.recordCount = 3;
            street_num_arr.data.push(record_2);
            street_num_arr.data.push(record_2);
            street_num_arr.data.push(record_3);
            break;

        // 3 records all w/same street_num
        case 33:
            street_num_arr.recordCount = 3;
            street_num_arr.data.push(record_3);
            street_num_arr.data.push(record_3);
            street_num_arr.data.push(record_3);
            break;

        // set default to match one record
        default:
            street_num_arr.recordCount = 1;
            street_num_arr.data.push(record_1);
            break;
    }

    logger.debug({ routine, message: `returning street_num_arr ${JSON.stringify(street_num_arr)}` });
    return street_num_arr;
};
