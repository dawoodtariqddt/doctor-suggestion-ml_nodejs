const db = require('./database');
const { getKNNModel } = require('./model');

async function suggestDoctor(userInput) {
    const knnModel = getKNNModel();
    const input = userInput.disability_related_to.concat(userInput.disability_with);

    const prediction = knnModel.predict([input])[0];

    const [doctorsData] = await db.execute(
        'SELECT id, specialities FROM doctors WHERE specialities = ?',
        [prediction]
    );

    return {
        prediction,
        doctors: doctorsData
    };
}

module.exports = {
    suggestDoctor
};
