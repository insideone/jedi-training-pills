const parseTrainValue = (trainName: string) => {
    try {
        return Number(trainName.match(/(\d+)P/)![1]);
    } catch (e) {
        return null;
    }
};

export default parseTrainValue;
